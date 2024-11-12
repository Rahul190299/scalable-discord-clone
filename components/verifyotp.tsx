"use client"
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
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSessionStore } from "@/store/sessionstore";
import { useRouter } from "next/navigation";
const formSchema = z.object({
    otp: z.string(),
  });
  
  export function VerifyOtp() {
    const email = useSessionStore((state) => state.email);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {},
    });
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      try{
        console.log(values);
        const inputObj = {...values,email};
        console.log(inputObj);
        const result = await fetch('/api/auth/verifyotp',{
          method : "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(inputObj),
        }); 
        switch(result.status){
          case 200:
            const res = await result.json();
            if(res.bSuccess){
              router.push("/");
            }
            break;
          default: 
            break;
        }
      }catch(error){
        console.log(error);
      }
    }
  
    return (
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
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Otp</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter otp here" {...field} />
                  </FormControl>
  
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </motion.div>
    );
  }