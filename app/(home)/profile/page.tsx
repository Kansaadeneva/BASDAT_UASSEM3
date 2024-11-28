import ProfileForm from "@/components/auth/profile-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Page() {
  const cookie = cookies();
  const user = cookie.get("user");
  let userData = null;

  if (user) {
    userData = JSON.parse(user.value);
  } else {
    redirect("/signin");
  }
  return (
    <div className="flex justify-center">
      <ProfileForm userData={userData} />
    </div>
  );
}
