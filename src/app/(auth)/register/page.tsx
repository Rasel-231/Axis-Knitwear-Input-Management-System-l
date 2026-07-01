import RegisterContainer from '../../../modules/auth/RegisterContainer';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-xl font-bold">Create account</h1>
      <RegisterContainer />
    </div>
  );
}
