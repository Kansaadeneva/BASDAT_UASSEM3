import { GlobeDemo } from "@/components/auth/github-globe";
import SignupForm from "@/components/auth/signup-form";

export default function Page() {
  return (
    <div className="grid grid-cols-12 py-10">
      <div className="col-span-7">
        <GlobeDemo />
      </div>
      <div className="col-span-5">
        <SignupForm />
      </div>
    </div>
  );
}
