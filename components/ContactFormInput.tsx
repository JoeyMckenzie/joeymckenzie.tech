import { useContactForm } from '@/lib/hooks/use-contact-form.hook';
import { VFC } from 'react';
import { CgSpinnerTwoAlt } from 'react-icons/cg';

const ContactFormInput: VFC = () => {
  const {
    handleSubmit,
    email,
    message,
    name,
    onEmailChange,
    onMessageChange,
    onNameChange,
    submitting,
  } = useContactForm();

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6">
      <div>
        <label htmlFor="full-name" className="sr-only">
          Name
        </label>
        <input
          type="text"
          name="full-name"
          id="full-name"
          autoComplete="name"
          required
          value={name}
          onChange={onNameChange}
          className="block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-stone-500 focus:ring-stone-500"
          placeholder="Name"
        />
      </div>
      <div>
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={onEmailChange}
          autoComplete="email"
          className="block w-full rounded-md border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-stone-500 focus:ring-stone-500"
          placeholder="Email"
        />
      </div>
      <div>
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={message}
          onChange={onMessageChange}
          className="block w-full rounded-md border border-gray-300 py-3 px-4 placeholder-gray-500 shadow-sm focus:border-stone-500 focus:ring-stone-500"
          placeholder="Message"
          defaultValue={''}
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={submitting}
          className="flex flex-row items-center justify-center gap-x-2 rounded-md border border-transparent bg-stone-800 py-3 px-6 text-base font-medium text-white shadow-sm hover:bg-stone-700 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-800 focus:ring-offset-2"
        >
          {submitting && <CgSpinnerTwoAlt className="animate-spin" />}
          Submit
        </button>
      </div>
    </form>
  );
};

export default ContactFormInput;
