import { useState } from "react";
import { Box, Flex, Text, Heading, Icon, Input } from "@chakra-ui/react";
import { User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import AuthBackground from "@components/auth/AuthBackground";
import AuthCard from "@components/auth/AuthCard";
import { AuthHook } from "@hooks/auth.hook";
import useAuthStore from "@stores/auth.store";
import useUserStore from "@stores/user.store";

interface LoginFormStepProps {
    onLoginSuccess: () => void;
    onForgotPassword: () => void;
}

const LoginFormStep = ({ onLoginSuccess, onForgotPassword }: LoginFormStepProps) => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { setAuth } = useAuthStore();
    const { setUser } = useUserStore();

    const { mutate: login, isPending } = AuthHook.useLogin({
        onSuccess: (data) => {
            // Save auth token
            setAuth(data.token, data.expiresIn);
            // Save user profile + permissions
            setUser(data.user, data.permissions);

            navigate("/");
            onLoginSuccess();
        },
        onError: (err) => {
            setError(err.message || "Login failed. Please try again.");
        },
    });

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password");
            return;
        }

        setError("");
        login({ email: username, password });
    };

    /* ─── Shared input styles ─── */
    const inputStyles = {
        bg: "white",
        border: "1px solid",
        borderColor: "gray.300",
        borderRadius: "xl",
        py: "7",
        px: "6",
        fontSize: "15px",
        fontWeight: "500",
        color: "#1e293b",
        _focus: {
            outline: "none",
            borderColor: "accent.500",
            boxShadow: "0 0 0 4px {colors.accent.100}",
        },
        _placeholder: { color: "gray.400" },
        transition: "all 0.2s",
    };

    return (
        <Flex
            py="10"
            minH="100vh"
            w="100%"
            align="center"
            justify="center"
            position="relative"
        >
            <AuthBackground />
            <AuthCard>
                {/* Header */}
                <Box textAlign="center" mb="10">
                    <Heading size="lg" fontWeight="900" color="#1e293b" mb="3">
                        Login
                    </Heading>
                    <Text fontSize="14px" fontWeight="500" color="gray.400">
                        Welcome back please login to your
                    </Text>
                </Box>

                {/* Form */}
                <form onSubmit={handleLoginSubmit}>
                    <Flex direction="column" gap="6">
                        {/* Email Input */}
                        <Box position="relative">
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter Email-Address"
                                {...inputStyles}
                            />
                            <Icon
                                as={User}
                                boxSize="5"
                                color="gray.400"
                                position="absolute"
                                right="6"
                                top="50%"
                                transform="translateY(-50%)"
                            />
                        </Box>

                        {/* Password Input */}
                        <Box position="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter Password"
                                {...inputStyles}
                            />
                            <Box
                                as="button"
                                onClick={() => setShowPassword(!showPassword)}
                                position="absolute"
                                right="6"
                                top="50%"
                                transform="translateY(-50%)"
                                color="gray.400"
                                _hover={{ color: "accent.500" }}
                                cursor="pointer"
                                bg="transparent"
                                border="none"
                                p="0"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </Box>
                        </Box>

                        {/* Error Message */}
                        {error && (
                            <Box bg="red.50" border="1px solid" borderColor="red.200" borderRadius="lg" p="3">
                                <Text fontSize="13px" fontWeight="500" color="red.600">
                                    {error}
                                </Text>
                            </Box>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            style={{
                                width: "100%",
                                padding: "16px 0",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: 900,
                                border: "none",
                                marginTop: "16px",
                                cursor: isPending ? "not-allowed" : "pointer",
                                transition: "all 0.2s",
                                /* Using CSS vars from theme */
                                backgroundColor: isPending ? "#A0AEC0" : "var(--chakra-colors-accent-500, #1273D4)",
                                color: "white",
                                boxShadow: "0 10px 25px rgba(18, 115, 212, 0.3)",
                            }}
                        >
                            {isPending ? "Logging in..." : "Login"}
                        </button>

                        {/* Forgot Password */}
                        <Box mt="10" textAlign="center">
                            <Text fontSize="13px" fontWeight="700" color="gray.400">
                                Forgot Password?{" "}
                                <Text
                                    as="span"
                                    color="#3b82f6"
                                    cursor="pointer"
                                    _hover={{ textDecoration: "underline" }}
                                    onClick={onForgotPassword}
                                >
                                    Click Here
                                </Text>
                            </Text>
                        </Box>
                    </Flex>
                </form>
            </AuthCard>
        </Flex>
    );
};

export default LoginFormStep;
