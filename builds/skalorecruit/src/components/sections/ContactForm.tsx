import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle, Send } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  name:    z.string().min(2, 'Name must be at least 2 characters'),
  email:   z.string().email('Please enter a valid email address'),
  company: z.string().optional(),
  phone:   z.string().optional(),
  subject: z.string().min(3, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setFormState('submitting');
    try {
      // TODO: Replace with actual Formspree endpoint or API
      console.log('Form submission:', data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setFormState('success');
    } catch {
      setFormState('error');
    }
  };

  if (formState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="text-green-600" size={32} />
        </div>
        <h3 className="font-heading text-xl font-semibold text-[var(--color-brand-text)] mb-2">Message sent!</h3>
        <p className="text-[var(--color-brand-text-muted)] max-w-sm">
          Thank you for reaching out. One of our consultants will be in touch within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          placeholder="James Mitchell"
          required
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="james@company.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Company"
          placeholder="Acme Financial Ltd"
          error={errors.company?.message}
          {...register('company')}
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="+44 20 7946 0000"
          error={errors.phone?.message}
          {...register('phone')}
        />
      </div>
      <div>
        <label htmlFor="subject" className="text-sm font-medium text-[var(--color-brand-text)] block mb-1.5">
          Subject <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <select
          id="subject"
          className="h-10 w-full rounded-lg border border-[var(--color-brand-border)] bg-white px-3 text-[var(--color-brand-text)] focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
          {...register('subject')}
        >
          <option value="">Select a topic...</option>
          <option value="hiring">I'm looking to hire</option>
          <option value="job-search">I'm looking for a role</option>
          <option value="partnership">Partnership enquiry</option>
          <option value="other">Other</option>
        </select>
        {errors.subject && <p className="text-xs text-red-600 mt-1" role="alert">{errors.subject.message}</p>}
      </div>
      <Textarea
        label="Message"
        placeholder="Tell us about your requirements..."
        required
        rows={5}
        error={errors.message?.message}
        {...register('message')}
      />
      {formState === 'error' && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm" role="alert">
          Something went wrong. Please try again or email us directly at hello@skalorecruit.com
        </div>
      )}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={formState === 'submitting'}
        leftIcon={<Send size={18} />}
        className="w-full sm:w-auto"
      >
        Send Message
      </Button>
    </form>
  );
}
