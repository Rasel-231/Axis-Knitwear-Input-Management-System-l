import LoginContainer from '../../../modules/auth/LoginContainer';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-xl font-bold">Login</h1>
      <LoginContainer />
    </div>
  );
}
