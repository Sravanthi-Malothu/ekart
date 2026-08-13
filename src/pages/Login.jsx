import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

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
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/v1/user/login', formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (res.data.success) {
        localStorage.setItem('accessToken', res.data.token);
        toast.success("Login successful");
        dispatch(setUser(res.data.user));
        navigate('/');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler} className="flex flex-col gap-4">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pr-10"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                {showPassword ? (
                  <Eye
                    onClick={() => setShowPassword(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 cursor-pointer"
                  />
                ) : (
                  <EyeOff
                    onClick={() => setShowPassword(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 cursor-pointer"
                  />
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full cursor-pointer bg-pink-600 hover:bg-pink-500"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-gray-700">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-pink-700 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
