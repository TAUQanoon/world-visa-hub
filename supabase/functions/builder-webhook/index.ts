import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const payload = await req.json();
    console.log('Received webhook:', payload);

    const eventType = payload.type || payload.event;
    const logEntry: any = {
      event_type: eventType,
      payload: payload,
      status: 'success',
      error_message: null,
    };

    // Handle different webhook events
    if (eventType === 'content.publish' || eventType === 'publish') {
      // Store or update published content
      const contentData = {
        content_id: payload.data?.id || payload.id,
        model: payload.data?.modelName || 'page',
        url_path: payload.data?.url || payload.url || '/',
        data: payload.data || payload,
        published: true,
      };

      const { error: upsertError } = await supabase
        .from('builder_content')
        .upsert(contentData, {
          onConflict: 'content_id',
        });

      if (upsertError) {
        throw upsertError;
      }

      console.log('Content published:', contentData.url_path);
    } else if (eventType === 'content.unpublish' || eventType === 'unpublish') {
      // Mark content as unpublished
      const { error: updateError } = await supabase
        .from('builder_content')
        .update({ published: false })
        .eq('content_id', payload.data?.id || payload.id);

      if (updateError) {
        throw updateError;
      }

      console.log('Content unpublished:', payload.data?.id || payload.id);
    } else if (eventType === 'form.submit') {
      // Store form submission
      const { error: formError } = await supabase
        .from('builder_forms')
        .insert({
          form_name: payload.formName || 'Unknown Form',
          submission_data: payload.data || payload,
          user_email: payload.data?.email || null,
          submitted_at: new Date().toISOString(),
        });

      if (formError) {
        throw formError;
      }

      console.log('Form submitted:', payload.formName);
    }

    // Log the webhook event
    await supabase.from('builder_webhook_logs').insert(logEntry);

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Webhook processing error:', error);

    // Log the error
    await supabase.from('builder_webhook_logs').insert({
      event_type: 'error',
      payload: {},
      status: 'error',
      error_message: error.message,
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
