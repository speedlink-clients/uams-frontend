import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import AuthBackground from '@components/shared/AuthBackground';
import AuthCard from '@components/shared/AuthCard';
import { Box, Flex, Text, Input, Button } from '@chakra-ui/react';

interface ForgotPasswordFlowProps {
    onBackToLogin?: () => void;
}

type RecoveryStep = 'forgot-password' | 'verify-code' | 'reset-password' | 'reset-success';

const ForgotPasswordFlow: React.FC<ForgotPasswordFlowProps> = ({ onBackToLogin }) => {
    const navigate = useNavigate();
    const handleBackToLogin = onBackToLogin || (() => navigate('/login'));
    const [internalStep, setInternalStep] = useState<RecoveryStep>('forgot-password');
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);

    const handleOtpChange = (index: number, val: string) => {
        if (val && !/^\d+$/.test(val)) return;
        const next = [...otp];
        if (!val) {
            next[index] = "";
            setOtp(next);
            return;
        }
        const digit = val.slice(-1);
        next[index] = digit;
        setOtp(next);
        if (digit && index < otp.length - 1) {
            const el = document.getElementById(`otp-${index + 1}`);
            el?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const el = document.getElementById(`otp-${index - 1}`);
            el?.focus();
        }
    };

    return (
        <Flex py="10" minH="100vh" w="full" alignItems="center" justifyContent="center" position="relative" fontFamily="'Inter'">
            <AuthBackground />
            <AuthCard>
                {internalStep === "forgot-password" && (
                    <>
                        <Box textAlign="center" mb="10">
                            <Text fontSize="xl" fontWeight="black" color="#1e293b" mb="3">
                                Forgot Password
                            </Text>
                            <Text fontSize="13px" fontWeight="medium" color="gray.400">
                                Let's retrieve your password together
                            </Text>
                        </Box>
                        <Flex direction="column" gap="6">
                            <Box>
                                <Text fontSize="13px" fontWeight="bold" color="#1e293b" px="1" mb="2">
                                    Email Address
                                </Text>
                                <Input
                                    type="email"
                                    placeholder="Enter email address"
                                    bg="white"
                                    border="xs"
                                    borderColor="border.muted"
                                    borderRadius="xl"
                                    py="4"
                                    px="6"
                                    fontSize="14px"
                                    fontWeight="medium"
                                    color="#1e293b"
                                    _focus={{ borderColor: "#1d76d2", boxShadow: "0 0 0 3px rgba(29,118,210,0.1)" }}
                                />
                            </Box>
                            <Button
                                onClick={() => setInternalStep("verify-code")}
                                w="full"
                                bg="#1d76d2"
                                color="white"
                                py="4"
                                borderRadius="xl"
                                fontSize="15px"
                                fontWeight="black"
                                boxShadow="lg"
                                _hover={{ bg: "#1565c0" }}
                            >
                                Send Code
                            </Button>
                            <Button
                                onClick={handleBackToLogin}
                                variant="ghost"
                                w="full"
                                fontSize="13px"
                                fontWeight="bold"
                                color="gray.400"
                                _hover={{ color: "blue.500" }}
                            >
                                <ArrowLeft size={16} />
                                <Text ml="2">Back to login</Text>
                            </Button>
                        </Flex>
                    </>
                )}
                {internalStep === "verify-code" && (
                    <>
                        <Box textAlign="center" mb="10">
                            <Text fontSize="xl" fontWeight="black" color="#1e293b" mb="3">
                                Enter Verification Code
                            </Text>
                            <Text fontSize="12px" fontWeight="medium" color="gray.400">
                                We sent a code to <Text as="span" fontWeight="bold">youremail@provider.com</Text>
                            </Text>
                        </Box>
                        <Flex direction="column" gap="8">
                            <Flex justifyContent="space-between" gap="2">
                                {otp.map((digit, i) => (
                                    <Input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(i, e)}
                                        w="full"
                                        h="12"
                                        textAlign="center"
                                        border="xs"
                                        borderColor="border.muted"
                                        borderRadius="lg"
                                        fontSize="lg"
                                        fontWeight="bold"
                                        color="#1e293b"
                                        _focus={{ borderColor: "#1d76d2", boxShadow: "0 0 0 2px rgba(29,118,210,0.1)" }}
                                    />
                                ))}
                            </Flex>
                            <Box textAlign="center">
                                <Text fontSize="12px" fontWeight="bold" color="gray.400">
                                    Didn't get the code?{" "}
                                    <Text as="button" color="#3b82f6" _hover={{ textDecoration: "underline" }}>
                                        Resend code
                                    </Text>
                                </Text>
                            </Box>
                            <Button
                                onClick={() => setInternalStep("reset-password")}
                                w="full"
                                bg="#1d76d2"
                                color="white"
                                py="4"
                                borderRadius="xl"
                                fontSize="15px"
                                fontWeight="black"
                                boxShadow="lg"
                                _hover={{ bg: "#1565c0" }}
                            >
                                Continue
                            </Button>
                        </Flex>
                    </>
                )}
                {internalStep === "reset-password" && (
                    <>
                        <Box textAlign="center" mb="10">
                            <Text fontSize="xl" fontWeight="black" color="#1e293b" mb="3">
                                Reset Password
                            </Text>
                            <Text fontSize="12px" fontWeight="medium" color="gray.400">
                                Update Password to enhance account security
                            </Text>
                        </Box>
                        <Flex direction="column" gap="6">
                            <Input
                                type="password"
                                placeholder="New Password"
                                bg="white"
                                border="xs"
                                borderColor="border.muted"
                                borderRadius="xl"
                                py="4"
                                px="6"
                                fontSize="14px"
                                fontWeight="medium"
                                color="#1e293b"
                                _focus={{ borderColor: "#1d76d2", boxShadow: "0 0 0 3px rgba(29,118,210,0.1)" }}
                            />
                            <Input
                                type="password"
                                placeholder="Confirm new Password"
                                bg="white"
                                border="xs"
                                borderColor="border.muted"
                                borderRadius="xl"
                                py="4"
                                px="6"
                                fontSize="14px"
                                fontWeight="medium"
                                color="#1e293b"
                                _focus={{ borderColor: "#1d76d2", boxShadow: "0 0 0 3px rgba(29,118,210,0.1)" }}
                            />
                            <Button
                                onClick={() => setInternalStep("reset-success")}
                                w="full"
                                bg="#1d76d2"
                                color="white"
                                py="4"
                                borderRadius="xl"
                                fontSize="15px"
                                fontWeight="black"
                                boxShadow="lg"
                                _hover={{ bg: "#1565c0" }}
                            >
                                Confirm
                            </Button>
                        </Flex>
                    </>
                )}
                {internalStep === "reset-success" && (
                    <>
                        <Box textAlign="center" mb="8">
                            <Flex justifyContent="center" mb="6">
                                <Flex
                                    w="20"
                                    h="20"
                                    bg="green.50"
                                    borderRadius="full"
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <CheckCircle size={40} color="#2ecc71" />
                                </Flex>
                            </Flex>
                            <Text fontSize="xl" fontWeight="black" color="#1e293b" mb="3">
                                Password Reset successfully
                            </Text>
                            <Text fontSize="12px" fontWeight="medium" color="gray.400">
                                Your password has been updated successfully
                            </Text>
                        </Box>
                        <Button
                            onClick={handleBackToLogin}
                            w="full"
                            bg="#1d76d2"
                            color="white"
                            py="4"
                            borderRadius="xl"
                            fontSize="15px"
                            fontWeight="black"
                            boxShadow="lg"
                            _hover={{ bg: "#1565c0" }}
                        >
                            Continue
                        </Button>
                    </>
                )}
            </AuthCard>
        </Flex>
    );
};

export default ForgotPasswordFlow;
