-- Create usage_logs table to store app usage data
CREATE TABLE public.usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  country TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (but allow public access for usage logs)
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert usage logs
CREATE POLICY "Allow public insert on usage logs" 
ON public.usage_logs 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow public read access to usage logs
CREATE POLICY "Allow public read on usage logs" 
ON public.usage_logs 
FOR SELECT 
USING (true);