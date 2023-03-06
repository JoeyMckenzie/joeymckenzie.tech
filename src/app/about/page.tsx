import AboutMe from './+AboutMe';

export default function About(): JSX.Element {
  return (
    <div className="py-12">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-center justify-center px-6 sm:flex-row lg:px-8">
        <AboutMe />
      </div>
    </div>
  );
}
