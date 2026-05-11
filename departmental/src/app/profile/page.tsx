import { useState } from "react";
import { Box, Flex, Text, Grid, Spinner, Input } from "@chakra-ui/react";
import { PasswordInput } from "@components/ui/password-input";
import { User, Lock, CheckCircle } from "lucide-react";
import useAuthStore from "@stores/auth.store";
import { UserServices } from "@services/user.service";
import { toaster } from "@components/ui/toaster";

const ProfilePage = () => {
    const { user, email, role } = useAuthStore();

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const roleDisplay = (user?.role || role || "User").replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toaster.error({ title: "Please fill in all password fields" });
            return;
        }
        if (newPassword.length < 6) {
            toaster.error({ title: "New password must be at least 6 characters" });
            return;
        }
        if (newPassword !== confirmPassword) {
            toaster.error({ title: "Passwords do not match" });
            return;
        }

        try {
            setIsChangingPassword(true);
            await UserServices.changePassword({ currentPassword, newPassword });
            toaster.success({ title: "Password changed successfully!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toaster.error({ title: error.response?.data?.message || "Failed to change password" });
        } finally {
            setIsChangingPassword(false);
        }
    };

    // Password strength meter
    const getPasswordStrength = (pw: string) => {
        if (!pw) return { label: "", color: "", width: "0%" };
        let score = 0;
        if (pw.length >= 6) score++;
        if (pw.length >= 10) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;

        if (score <= 1) return { label: "Weak", color: "#ef4444", width: "20%" };
        if (score === 2) return { label: "Fair", color: "#f97316", width: "40%" };
        if (score === 3) return { label: "Good", color: "#eab308", width: "60%" };
        if (score === 4) return { label: "Strong", color: "#22c55e", width: "80%" };
        return { label: "Excellent", color: "#10b981", width: "100%" };
    };

    const strength = getPasswordStrength(newPassword);



    return (
        <Box>
            <Text fontSize="2xl" fontWeight="bold" color="slate.800" mb="6">Profile</Text>

            <Flex direction={{ base: "column", xl: "row" }} gap="6" alignItems="flex-start">
                {/* Account Details Card */}
                <Box flex="5" bg="white" borderRadius="2xl" border="xs" borderColor="border.muted" p="8">
                            <Flex alignItems="center" gap="2" mb="6">
                                <User size={20} color="#1D7AD9" />
                                <Text fontSize="lg" fontWeight="bold" color="slate.800">Account Details</Text>
                            </Flex>

                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="5">
                                <ReadOnlyField label="First Name" value={user?.firstName + " " + user?.middleNames || "—"} />
                                <ReadOnlyField label="Last Name" value={user?.lastName || "—"} />
                                <ReadOnlyField label="Email Address" value={user?.email || email || "—"} />
                                <ReadOnlyField label="Phone Number" value={user?.phone || "—"} />
                                <ReadOnlyField label="Department" value={`${user?.department?.name || "—"} (${user?.department?.code || ""})`} />
                                <ReadOnlyField label="Faculty" value={`${user?.profile?.facultyName || "—"} (${user?.profile?.facultyCode || ""})`} />
                                <ReadOnlyField label="University" value={user?.university?.name || "—"} />
                                <ReadOnlyField label="Role" value={roleDisplay} />
                            </Grid>
                        </Box>

                {/* Password Change Card */}
                <Box flex="4" bg="white" borderRadius="2xl" border="xs" borderColor="border.muted" p="8">
                            <Flex alignItems="center" gap="2" mb="2">
                                <Lock size={20} color="#1D7AD9" />
                                <Text fontSize="lg" fontWeight="bold" color="slate.800">Change Password</Text>
                            </Flex>
                            <Text fontSize="sm" color="slate.400" mb="6">Update your password to keep your account secure.</Text>

                            <Flex direction="column" gap="5">
                                {/* Current Password */}
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color="slate.400" textTransform="uppercase" letterSpacing="wider" mb="2">Current Password</Text>
                                    <PasswordInput
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        size="lg"
                                        bg="slate.50"
                                        border="xs"
                                        borderColor="border.muted"
                                        borderRadius="xl"
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="slate.800"
                                        _focus={{ borderColor: "blue.500" }}
                                    />
                                </Box>

                                {/* New Password */}
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color="slate.400" textTransform="uppercase" letterSpacing="wider" mb="2">New Password</Text>
                                    <PasswordInput
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        size="lg"
                                        bg="slate.50"
                                        border="xs"
                                        borderColor="border.muted"
                                        borderRadius="xl"
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="slate.800"
                                        _focus={{ borderColor: "blue.500" }}
                                    />
                                    {newPassword && (
                                        <Box mt="2">
                                            <Box w="full" h="4px" bg="gray.100" borderRadius="full" overflow="hidden">
                                                <Box h="full" bg={strength.color} w={strength.width} borderRadius="full" transition="all 0.3s" />
                                            </Box>
                                            <Text fontSize="xs" color={strength.color} fontWeight="bold" mt="1">{strength.label}</Text>
                                        </Box>
                                    )}
                                </Box>

                                {/* Confirm Password */}
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color="slate.400" textTransform="uppercase" letterSpacing="wider" mb="2">Confirm New Password</Text>
                                    <PasswordInput
                                        placeholder="Re-enter new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        size="lg"
                                        bg="slate.50"
                                        border="xs"
                                        borderColor="border.muted"
                                        borderRadius="xl"
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="slate.800"
                                        _focus={{ borderColor: "blue.500" }}
                                    />
                                    {confirmPassword && newPassword && (
                                        <Flex alignItems="center" gap="1" mt="1">
                                            {confirmPassword === newPassword ? (
                                                <>
                                                    <CheckCircle size={12} color="#22c55e" />
                                                    <Text fontSize="xs" color="#22c55e" fontWeight="bold">Passwords match</Text>
                                                </>
                                            ) : (
                                                <Text fontSize="xs" color="#ef4444" fontWeight="bold">Passwords do not match</Text>
                                            )}
                                        </Flex>
                                    )}
                                </Box>
                            </Flex>

                            <Flex mt="6" justifyContent="flex-end">
                                <Flex
                                    as="button"
                                    onClick={handleChangePassword}
                                    bg="#1D7AD9" color="white" px="8" py="3"
                                    borderRadius="xl" fontSize="sm" fontWeight="bold"
                                    cursor={isChangingPassword ? "not-allowed" : "pointer"}
                                    opacity={isChangingPassword ? 0.6 : 1}
                                    border="none" transition="all 0.2s"
                                    _hover={{ bg: isChangingPassword ? "#1D7AD9" : "#1565c0" }}
                                    alignItems="center" gap="2"
                                >
                                    {isChangingPassword ? (
                                        <><Spinner size="sm" /> Changing...</>
                                    ) : (
                                        <><Lock size={16} /> Update Password</>
                                    )}
                                </Flex>
                            </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

// ── Reusable sub-components ─────────────────────────────────────────



const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
    <Box>
        <Text fontSize="xs" fontWeight="bold" color="slate.400" textTransform="uppercase" letterSpacing="wider" mb="2">{label}</Text>
        <Input
            type="text"
            value={value}
            readOnly
            bg="slate.100"
            border="xs"
            borderColor="border.muted"
            borderRadius="xl"
            fontSize="sm"
            color="slate.800"
            fontWeight="medium"
            cursor="not-allowed"
            _readOnly={{ opacity: 0.8 }}
            size="lg"
        />
    </Box>
);

export default ProfilePage;
