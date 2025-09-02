-- Create table to cache onOffice estates
CREATE TABLE public.onoffice_estates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  estate_id text NOT NULL,
  estate_data jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, estate_id)
);

-- Enable RLS
ALTER TABLE public.onoffice_estates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own estates" 
ON public.onoffice_estates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own estates" 
ON public.onoffice_estates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own estates" 
ON public.onoffice_estates 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own estates" 
ON public.onoffice_estates 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_onoffice_estates_updated_at
BEFORE UPDATE ON public.onoffice_estates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();