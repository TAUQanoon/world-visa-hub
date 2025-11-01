-- Allow staff to mark messages as read
CREATE POLICY "Staff can mark messages as read"
ON public.messages
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'staff') OR has_role(auth.uid(), 'admin'));

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;