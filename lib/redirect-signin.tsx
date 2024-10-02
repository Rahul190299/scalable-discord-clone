//import { redirectToSignIn } from "@clerk/nextjs";

import { useRouter } from "next/router"

export default redirectToSignIn = () => {
    const router = useRouter();
    router.push("/sign-up");
}