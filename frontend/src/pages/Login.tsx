import { ConnectWallet } from "@nfid/identitykit/react";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ConnectWallet />
    </div>
  );
};

export default Login; 