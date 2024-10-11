import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { ca } from "date-fns/locale"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const formSchema = z.object({
    otp : z.string()
})

export function VerifyOtp(){
    
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    
    console.log(values)
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
            control={form.control}
            name = "otp"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Otp</FormLabel>
                  <FormControl>
                    <Input placeholder="otp" {...field} />
                  </FormControl>
                  
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
        </form>
    </Form>
  )

}