import type { AccountManagerProfile } from "@/services/account-manager.service";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";

type WelcomeCardProps = {
  profile: AccountManagerProfile;
};

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(" ");
  const first = parts[0]?.charAt(0).toUpperCase() ?? "";
  const last = parts[1]?.charAt(0).toUpperCase() ?? "";
  return (first + last) || "U";
}

export default function WelcomeCard({ profile }: WelcomeCardProps) {
  const { fullName, email, mobileNo } = profile;
  const initials = getInitials(fullName);

  return (
    <div className="rounded-xl bg-white shadow-sm">
      <div className="relative rounded-t-xl bg-[#c8cff8] px-5 pb-8 pt-5">
        <div>
          <p className="text-xl font-bold text-[#4f66d4]">Welcome Back!</p>
          <p className="mt-0.5 text-sm text-[#6b7fcc]">Account Manager</p>
        </div>
        <div className="absolute bottom-0 right-4 h-24 w-28">
          <Image src="/assets/user.png" alt="Dashboard illustration" fill className="object-contain object-bottom" priority />
        </div>
      </div>
      <div className="relative z-10 -mt-7 px-5">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#edf1ff] text-lg font-bold text-[#556ee6] shadow">{initials}</div>
      </div>
      <div className="px-5 pb-6 pt-2 space-y-1.5">
        <p className="text-base font-semibold text-[#3a4050]">{fullName}</p>
        <p className="text-xs text-[#8a92a6]">Account Manager</p>
        <div className="pt-1 space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#6b7280]">
            <Mail size={14} className="flex-shrink-0 text-[#556ee6]" />
            <span className="truncate">{email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6b7280]">
            <Phone size={14} className="flex-shrink-0 text-[#556ee6]" />
            <span>+91 {mobileNo}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
