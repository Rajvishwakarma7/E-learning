import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/Redux/Api/authApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [signupInpput, setSignupInpput] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginisLoading,
      isSuccess: loginisSuccess,
    },
  ] = useLoginUserMutation();
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerisLoading,
      isSuccess: registerisSuccess,
    },
  ] = useRegisterUserMutation();

  useEffect(() => {
    if (loginData && loginisSuccess) {
      toast({ title: "User Login successfully." });
      navigate("/");
    }
    if (registerData && registerisSuccess) {
      toast({ title: "User register successfully." });
    }
    if (registerError) {
      toast({ title: "Register Failed." });
    }
    if (loginError) {
      toast({ title: "Login Failed." });
    }
  }, [
    loginData,
    loginError,
    loginisLoading,
    registerData,
    registerError,
    loginisLoading,
  ]);
  function changeInputHandler(e, type) {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInpput({ ...signupInpput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  }

  async function handleSubmit(submitType) {
    const inputData = submitType === "signup" ? signupInpput : loginInput;
    const action = submitType === "signup" ? registerUser : loginUser;
    await action(inputData);
  }

  return (
    <div className="flex items-center w-full h-full justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Make your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={signupInpput.name}
                  type="text"
                  required
                  placeholder="Eg. Raj"
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={signupInpput.email}
                  type="email"
                  required
                  placeholder="Eg. raj@gmail.com"
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  value={signupInpput.password}
                  type="password"
                  required
                  placeholder="Eg. xyz"
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={registerisLoading}
                onClick={() => {
                  handleSubmit("signup");
                }}
              >
                {registerisLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 animate-spin" /> Please Wait{" "}
                  </>
                ) : (
                  "signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Login</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) => changeInputHandler(e, "login")}
                  name="email"
                  value={loginInput.email}
                  id="email"
                  type="email"
                  required
                  placeholder="Eg. raj@gmail.com"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={(e) => changeInputHandler(e, "login")}
                  name="password"
                  value={loginInput.password}
                  id="password"
                  type="password"
                  required
                  placeholder="Eg. xyz"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={loginisLoading}
                onClick={() => {
                  handleSubmit("logn");
                }}
              >
                {loginisLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 animate-spin" /> Please Wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Login;
