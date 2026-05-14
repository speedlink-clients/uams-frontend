import { useState } from "react";
import { Box, Flex, Text, Grid, Button, Field, Stack } from "@chakra-ui/react";
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
            <Text fontSize="2xl" fontWeight="bold" color="fg.muted" mb="6">Profile</Text>

            <Flex direction={{ base: "column", xl: "row" }} gap="6" alignItems="flex-start">
                {/* Account Details Card */}
                <Box flex="5" bg="white" borderRadius="md" border="xs" borderColor="border.muted" p="8">
                            <Flex alignItems="center" gap="2" mb="6">
                                <User size={20} color="#1D7AD9" />
                                <Text fontSize="lg" fontWeight="bold" color="fg.muted">Account Details</Text>
                            </Flex>

                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="5">
                                <ReadOnlyField label="First Name" value={((user as any)?.firstName ?? "") + " " + ((user as any)?.middleNames ?? "") || "—"} />
                                <ReadOnlyField label="Last Name" value={(user as any)?.lastName || "—"} />
                                <ReadOnlyField label="Email Address" value={user?.email || email || "—"} />
                                <ReadOnlyField label="Phone Number" value={user?.phone || "—"} />
                                <ReadOnlyField label="Department" value={`${(user as any)?.department?.name || "—"} (${(user as any)?.department?.code || ""})`} />
                                <ReadOnlyField label="Faculty" value={`${(user as any)?.profile?.facultyName || "—"} (${(user as any)?.profile?.facultyCode || ""})`} />
                                <ReadOnlyField label="University" value={(user as any)?.university?.name || "—"} />
                                <ReadOnlyField label="Role" value={roleDisplay} />
                            </Grid>
                        </Box>

                {/* Password Change Card */}
                <Box flex="4" bg="white" borderRadius="md" border="xs" borderColor="border.muted" p="8">
                            <Flex alignItems="center" gap="2" mb="2">
                                <Lock size={20} color="#1D7AD9" />
                                <Text fontSize="lg" fontWeight="bold" color="fg.muted">Change Password</Text>
                            </Flex>
                            <Text fontSize="sm" color="fg.subtle" mb="6">Update your password to keep your account secure.</Text>

                            <Stack gap="5">
                                {/* Current Password */}
                                <Field.Root>
                                    <Field.Label>Current Password</Field.Label>
                                    <PasswordInput
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        size="xl"
                                    />
                                </Field.Root>

                                {/* New Password */}
                                <Field.Root>
                                    <Field.Label>New Password</Field.Label>
                                    <PasswordInput
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        size="xl"
                                    />
                                    {newPassword && (
                                        <Box mt="2">
                                            <Box w="full" h="4px" bg="bg.muted" borderRadius="full" overflow="hidden">
                                                <Box h="full" bg={strength.color} w={strength.width} borderRadius="full" transition="all 0.3s" />
                                            </Box>
                                            <Text fontSize="xs" color={strength.color} fontWeight="bold" mt="1">{strength.label}</Text>
                                        </Box>
                                    )}
                                </Field.Root>

                                {/* Confirm Password */}
                                <Field.Root>
                                    <Field.Label>Confirm New Password</Field.Label>
                                    <PasswordInput
                                        placeholder="Re-enter new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={isChangingPassword}
                                        size="xl"
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
                                </Field.Root>
                            </Stack>

                            <Flex mt="6" justifyContent="flex-end">
                                <Button
                                    onClick={handleChangePassword}
                                    loading={isChangingPassword}
                                    loadingText="Changing..."
                                    disabled={isChangingPassword}
                                    size="lg"
                                    colorPalette="accent" 
                                >
                                    <Lock size={16} /> Update Password
                                </Button>
                            </Flex>
                </Box>
            </Flex>
        </Box>
    );
};

// ── Reusable sub-components ─────────────────────────────────────────



const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
    <Box>
        <Text fontSize="xs" fontWeight="bold" color="fg.subtle" textTransform="uppercase" letterSpacing="wider" mb="1">{label}</Text>
        <Text fontSize="sm" fontWeight="medium" color="fg.muted">{value}</Text>
    </Box>
);

export default ProfilePage;
