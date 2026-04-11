"use client";
import React, { useState } from 'react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [fields, setFields] = useState({
    title: "",
    problem: "",
    targetUser: "",
    industry: "",
  })

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted", fields);
    try {
      const response = await  axios.post("/api/search-idea", fields);

      if(response.data.success){
        toast.success(response.data.message)
      }

      router.push(`/idea/${response.data.data._id}`)
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong")
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });
  }
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Tell me about your idea
        </h2>
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="title" type="text" name='title' onChange={handleChange}/>
          </LabelInputContainer>
  
          <LabelInputContainer className="mb-4">
            <Label htmlFor="problem">Problem</Label>
            <Input id="problem" placeholder="problem" type="text" name='problem' onChange={handleChange} />
          </LabelInputContainer>
  
          <LabelInputContainer className="mb-4">
            <Label htmlFor="targetUser">Target User</Label>
            <Input id="targetUser" placeholder="targetUser" type="text" name='targetUser' onChange={handleChange} />
          </LabelInputContainer>
  
          <LabelInputContainer className="mb-4">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" placeholder="industry" type="text" name='industry' onChange={handleChange} />
          </LabelInputContainer>
  
          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
          >
            Sign up &rarr;
            <BottomGradient />
          </button>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
 
const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default Dashboard
