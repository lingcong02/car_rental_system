import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}

export function UserInput({ label, value, onChange, type = "text" }: UserInputProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label className="text-right">{label}</Label>
      <Input id={label.toLowerCase()} type={type} value={value} onChange={(e) => onChange(e.target.value)} required className="col-span-3" />
    </div>
  );
}
