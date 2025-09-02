-- Drop and recreate RLS policies for templates table to fix the issue
DROP POLICY IF EXISTS "Users can view their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can create their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public.templates;

-- Recreate policies with explicit auth.uid() checks
CREATE POLICY "Users can view their own templates" 
ON public.templates 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates" 
ON public.templates 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" 
ON public.templates 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" 
ON public.templates 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);