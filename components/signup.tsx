"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one special character",
    }),
});

export function ProfileForm() {

  const router = useRouter();
  // ...
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const result = await fetch('/api/auth/signup',{
      method : "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    }); 
    switch(result.status){
      case 200:
        const res = result.json();
        router.push('/verifyotp')
        break;
      case 400:
         alert('user alredy exist login to proceed')
        break;
      default:
        break;
    }
    
    //call api to store values in db
  }

  return (
    <section className="wrapper relative flex min-h-screen items-center justify-center overflow-hidden antialiased w-3/4">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          type: "spring",
          damping: 10,
        }}
        className="flex w-full flex-col justify-between gap-6 rounded-2xl bg-primary/5 px-16 py-8 md:max-w-[30vw]"
      >
        <div className="flex flex-col text-center w-full">
          <h2 className="text-3xl font-semibold tracking-tighter md:text-4xl">
            Welcome to{" "}
            <span className="bg-gradient-to-b from-blue-400 to-blue-700 bg-clip-text pr-1 font-black tracking-tighter text-transparent">
              Discord
            </span>
          </h2>
          <p className="text-lg font-medium tracking-tighter text-primary/75 md:text-xl">
            Log in to create servers!
          </p>
        </div>
        <div className="flex flex-col gap-8 w-full">
          <div className="grid w-full items-center gap-4">
            <div className="relative flex flex-col gap-2">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input className="focus:ring-none border-none bg-primary/5 focus:outline-none w-full" placeholder="username" {...field} />
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input className="focus:ring-none border-none bg-primary/5 focus:outline-none"  placeholder="email" {...field} />
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input className="focus:ring-none border-none bg-primary/5 focus:outline-none" placeholder="password" {...field} />
                        </FormControl>

                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full bg-blue-700		text-white hover:bg-sky-700" type="submit">Signup</Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="absolute -bottom-[16rem] -z-[20] size-[48rem] h-1/2 overflow-hidden rounded-full bg-gradient-to-t from-blue-400 to-blue-700 blur-[16em]" >
      </div>
    </section>
  );
}
