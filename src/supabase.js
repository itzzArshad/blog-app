// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vylwjzwuhfwnkydtuqwn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bHdqend1aGZ3bmt5ZHR1cXduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5MDQyNTUsImV4cCI6MjA1MzQ4MDI1NX0.OGgHqELOInY_mKmO7QxJgE_5qiIaeMa7MoMZSRwlJM0';

export const supabase = createClient(supabaseUrl, supabaseKey);
