import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const clientProfileSchema = z.object({
  date_of_birth: z.string().optional(),
  place_of_birth: z.string().max(200, "Place of birth must be less than 200 characters").optional(),
  nationality: z.string().max(100, "Nationality must be less than 100 characters").optional(),
  passport_number: z.string().max(50, "Passport number must be less than 50 characters").optional(),
  passport_issue_date: z.string().optional(),
  passport_expiry_date: z.string().optional(),
  passport_issuing_country: z.string().max(100, "Country must be less than 100 characters").optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  marital_status: z.enum(["single", "married", "divorced", "widowed", "separated"]).optional(),
  address_line1: z.string().max(200, "Address must be less than 200 characters").optional(),
  address_line2: z.string().max(200, "Address must be less than 200 characters").optional(),
  city: z.string().max(100, "City must be less than 100 characters").optional(),
  state_province: z.string().max(100, "State/Province must be less than 100 characters").optional(),
  postal_code: z.string().max(20, "Postal code must be less than 20 characters").optional(),
  country: z.string().max(100, "Country must be less than 100 characters").optional(),
  emergency_contact_name: z.string().max(100, "Name must be less than 100 characters").optional(),
  emergency_contact_phone: z.string().max(30, "Phone must be less than 30 characters").optional(),
  emergency_contact_relationship: z.string().max(50, "Relationship must be less than 50 characters").optional(),
});

type ClientProfileFormData = z.infer<typeof clientProfileSchema>;

interface ClientProfileFormProps {
  defaultValues?: Partial<ClientProfileFormData>;
  onSubmit: (data: ClientProfileFormData) => Promise<void>;
  isLoading?: boolean;
}

export function ClientProfileForm({ defaultValues, onSubmit, isLoading }: ClientProfileFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ClientProfileFormData>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date_of_birth">Date of Birth</Label>
              <Input type="date" id="date_of_birth" {...register("date_of_birth")} />
              {errors.date_of_birth && (
                <p className="text-sm text-destructive mt-1">{errors.date_of_birth.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="place_of_birth">Place of Birth</Label>
              <Input id="place_of_birth" {...register("place_of_birth")} />
              {errors.place_of_birth && (
                <p className="text-sm text-destructive mt-1">{errors.place_of_birth.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input id="nationality" {...register("nationality")} />
              {errors.nationality && (
                <p className="text-sm text-destructive mt-1">{errors.nationality.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={(value) => setValue("gender", value as any)} defaultValue={defaultValues?.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="marital_status">Marital Status</Label>
              <Select onValueChange={(value) => setValue("marital_status", value as any)} defaultValue={defaultValues?.marital_status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Passport Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="passport_number">Passport Number</Label>
              <Input id="passport_number" {...register("passport_number")} />
              {errors.passport_number && (
                <p className="text-sm text-destructive mt-1">{errors.passport_number.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="passport_issuing_country">Issuing Country</Label>
              <Input id="passport_issuing_country" {...register("passport_issuing_country")} />
              {errors.passport_issuing_country && (
                <p className="text-sm text-destructive mt-1">{errors.passport_issuing_country.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="passport_issue_date">Issue Date</Label>
              <Input type="date" id="passport_issue_date" {...register("passport_issue_date")} />
            </div>

            <div>
              <Label htmlFor="passport_expiry_date">Expiry Date</Label>
              <Input type="date" id="passport_expiry_date" {...register("passport_expiry_date")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address_line1">Address Line 1</Label>
            <Input id="address_line1" {...register("address_line1")} />
            {errors.address_line1 && (
              <p className="text-sm text-destructive mt-1">{errors.address_line1.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address_line2">Address Line 2</Label>
            <Input id="address_line2" {...register("address_line2")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
              {errors.city && (
                <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="state_province">State/Province</Label>
              <Input id="state_province" {...register("state_province")} />
            </div>

            <div>
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input id="postal_code" {...register("postal_code")} />
            </div>

            <div>
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="emergency_contact_name">Name</Label>
              <Input id="emergency_contact_name" {...register("emergency_contact_name")} />
            </div>

            <div>
              <Label htmlFor="emergency_contact_phone">Phone</Label>
              <Input id="emergency_contact_phone" {...register("emergency_contact_phone")} />
            </div>

            <div>
              <Label htmlFor="emergency_contact_relationship">Relationship</Label>
              <Input id="emergency_contact_relationship" {...register("emergency_contact_relationship")} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Profile
      </Button>
    </form>
  );
}