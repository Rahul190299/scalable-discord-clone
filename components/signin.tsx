"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast"

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
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export function SignInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });
  const {toast} = useToast();
  const router = useRouter();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      const result = await fetch('/api/auth/signin',{
        method : "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      }); 
      const res = await result.json();
      const redirectUrl = res.redirect?.toString();
      const strMessage = res.message?.toString();
      switch(result.status){
        case 200:
          if(redirectUrl === '/'){
            router.push(redirectUrl);
          }
          else{
            toast({
              description: strMessage,
            })
          }
          break;
        case 400:
          toast({
            description: strMessage,
            
          })
          break;
        case 500:
          toast({
            description: "Internal server error please try again",
            variant : "destructive"
          })
          break;
      }
    }catch(error){

    }
    console.log(values);
  }

  return (
    <section className="wrapper relative flex min-h-screen items-center justify-center overflow-hidden antialiased">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          type: "spring",
          damping: 10,
        }}
        className="flex w-full flex-col justify-between gap-12 rounded-2xl bg-primary/5 p-8 md:max-w-[30vw]"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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
                    <Input placeholder="password" {...field} />
                  </FormControl>

                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button type="submit">Login</Button>
            
          </form>
        </Form>
        
      </motion.div>
    </section>
  );
}
