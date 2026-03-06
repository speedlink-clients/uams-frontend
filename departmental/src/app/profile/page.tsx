import { useState } from "react";
import { Box, Flex, Text, Grid, Spinner } from "@chakra-ui/react";
import { User, Mail, Shield, Building2, Eye, EyeOff, Lock, CheckCircle, Phone, GraduationCap, Calendar, Globe } from "lucide-react";
import useAuthStore from "@stores/auth.store";
import { UserServices } from "@services/user.service";
import { toaster } from "@components/ui/toaster";

const ProfilePage = () => {
    const { user, email, role } = useAuthStore();

    // Password change state
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    // Derived display values
    const displayName = user?.fullName || email?.split("@")[0] || "User";
    const initials = displayName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
    const roleDisplay = (user?.role || role || "User").replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
    const joinedDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : null;

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

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px 16px",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        fontSize: "14px",
        outline: "none",
        transition: "all 0.2s",
        color: "#1e293b",
        fontWeight: 500,
    };

    // const readOnlyInputStyle: React.CSSProperties = {
    //     ...inputStyle,
    //     backgroundColor: "#f1f5f9",
    //     cursor: "not-allowed",
    //     paddingLeft: "44px",
    // };

    const passwordInputStyle: React.CSSProperties = {
        ...inputStyle,
        paddingRight: "48px",
    };

    return (
        <Box>
            <Text fontSize="2xl" fontWeight="bold" color="slate.800" mb="6">Profile</Text>

            <Flex direction={{ base: "column", lg: "row" }} gap="6">
                {/* Left Column — Profile Card */}
                <Box flex="1" maxW={{ lg: "340px" }}>
                    <Box
                        bg="white"
                        borderRadius="2xl"
                        boxShadow="sm"
                        border="1px solid"
                        borderColor="gray.100"
                        overflow="hidden"
                    >
                        {/* Gradient Banner */}
                        <Box
                            h="55px"
                            bgGradient="to-br"
                            gradientFrom="#1D7AD9"
                            gradientTo="#3b82f6"
                            borderTopRadius="2xl"
                        />

                        {/* Avatar + Identity */}
                        <Flex direction="column" alignItems="center" mt="-36px" pb="6" px="6">
                            <Flex
                                w="80px"
                                h="80px"
                                borderRadius="2xl"
                                border="4px solid"
                                borderColor="white"
                                boxShadow="lg"
                                alignItems="center"
                                justifyContent="center"
                                mb="3"
                                overflow="hidden"
                            >
                                <Flex
                                    w="full"
                                    h="full"
                                    alignItems="center"
                                    justifyContent="center"
                                    bgGradient="to-br"
                                    gradientFrom="#1D7AD9"
                                    gradientTo="#60a5fa"
                                >
                                    <Text fontSize="xl" fontWeight="black" color="white">{initials}</Text>
                                </Flex>
                            </Flex>

                            <Text fontSize="lg" fontWeight="bold" color="slate.800" mb="0.5">{displayName}</Text>
                            <Flex alignItems="center" gap="1.5" mb="1">
                                <Shield size={12} color="#1D7AD9" />
                                <Text fontSize="xs" fontWeight="bold" color="#1D7AD9" textTransform="uppercase" letterSpacing="wider">
                                    {roleDisplay}
                                </Text>
                            </Flex>
                            {joinedDate && (
                                <Flex alignItems="center" gap="1">
                                    <Calendar size={11} color="#94a3b8" />
                                    <Text fontSize="xs" color="slate.400" fontWeight="medium">Joined {joinedDate}</Text>
                                </Flex>
                            )}

                            <Box w="full" h="1px" bg="gray.100" my="4" />

                            {/* Quick Info Items */}
                            <Flex direction="column" w="full" gap="3.5">
                                <InfoRow icon={<Mail size={15} />} iconBg="blue.50" iconColor="#1D7AD9" label="Email" value={user?.email || email || "Not set"} />
                                {user?.phone && <InfoRow icon={<Phone size={15} />} iconBg="green.50" iconColor="#16a34a" label="Phone" value={user.phone} />}
                                <InfoRow icon={<Building2 size={15} />} iconBg="purple.50" iconColor="#7c3aed" label="Department" value={user?.department?.name || "N/A"} />
                                <InfoRow icon={<GraduationCap size={15} />} iconBg="orange.50" iconColor="#ea580c" label="Faculty" value={user?.profile?.facultyName || user?.department?.faculty?.name || "N/A"} />
                                <InfoRow icon={<Globe size={15} />} iconBg="cyan.50" iconColor="#0891b2" label="University" value={user?.university?.name || "N/A"} />
                            </Flex>
                        </Flex>
                    </Box>
                </Box>

                {/* Right Column */}
                <Box flex="2">
                    <Flex direction="column" gap="6">
                        {/* Account Details Card */}
                        <Box bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" p="8">
                            <Flex alignItems="center" gap="2" mb="6">
                                <User size={20} color="#1D7AD9" />
                                <Text fontSize="lg" fontWeight="bold" color="slate.800">Account Details</Text>
                            </Flex>

                            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="5">
                                <ReadOnlyField icon={<User size={16} />} label="First Name" value={user?.firstName + " " + user?.middleNames || "—"} />
                                <ReadOnlyField icon={<User size={16} />} label="Last Name" value={user?.lastName || "—"} />
                                <ReadOnlyField icon={<Mail size={16} />} label="Email Address" value={user?.email || email || "—"} />
                                <ReadOnlyField icon={<Phone size={16} />} label="Phone Number" value={user?.phone || "—"} />
                                <ReadOnlyField icon={<Building2 size={16} />} label="Department" value={`${user?.department?.name || "—"} (${user?.department?.code || ""})`} />
                                <ReadOnlyField icon={<GraduationCap size={16} />} label="Faculty" value={`${user?.profile?.facultyName || "—"} (${user?.profile?.facultyCode || ""})`} />
                                <ReadOnlyField icon={<Globe size={16} />} label="University" value={user?.university?.name || "—"} />
                                <ReadOnlyField icon={<Shield size={16} />} label="Role" value={roleDisplay} />
                            </Grid>
                        </Box>

                        {/* Password Change Card */}
                        <Box bg="white" borderRadius="2xl" boxShadow="sm" border="1px solid" borderColor="gray.100" p="8">
                            <Flex alignItems="center" gap="2" mb="2">
                                <Lock size={20} color="#1D7AD9" />
                                <Text fontSize="lg" fontWeight="bold" color="slate.800">Change Password</Text>
                            </Flex>
                            <Text fontSize="sm" color="slate.400" mb="6">Update your password to keep your account secure.</Text>

                            <Flex direction="column" gap="5">
                                {/* Current Password */}
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color="slate.400" textTransform="uppercase" letterSpacing="wider" mb="2">Current Password</Text>
                                    <Box position="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="Enter current password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            disabled={isChangingPassword}
                                            style={passwordInputStyle}
                                        />
                                        <Box
                                            as="button"
                                            position="absolute" right="14px" top="50%" transform="translateY(-50%)"
                                            color="slate.400" bg="transparent" border="none" cursor="pointer"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            _hover={{ color: "blue.500" }}
                                        >
                                            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* New Password */}
                                <Box>
                                    <Text fontSize="xs" fontWeight="bold" color="slate.400" textTransform="uppercase" letterSpacing="wider" mb="2">New Password</Text>
                                    <Box position="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={isChangingPassword}
                                            style={passwordInputStyle}
                                        />
                                        <Box
                                            as="button"
                                            position="absolute" right="14px" top="50%" transform="translateY(-50%)"
                                            color="slate.400" bg="transparent" border="none" cursor="pointer"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            _hover={{ color: "blue.500" }}
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </Box>
                                    </Box>
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
                                    <Box position="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isChangingPassword}
                                            style={passwordInputStyle}
                                        />
                                        <Box
                                            as="button"
                                            position="absolute" right="14px" top="50%" transform="translateY(-50%)"
                                            color="slate.400" bg="transparent" border="none" cursor="pointer"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            _hover={{ color: "blue.500" }}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </Box>
                                    </Box>
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
                                    boxShadow="0 4px 14px rgba(29, 122, 217, 0.25)"
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
            </Flex>
        </Box>
    );
};

// ── Reusable sub-components ─────────────────────────────────────────

const InfoRow = ({ icon, iconBg, iconColor, label, value }: { icon: React.ReactNode; iconBg: string; iconColor: string; label: string; value: string }) => (
    <Flex alignItems="center" gap="3">
        <Flex w="34px" h="34px" borderRadius="xl" bg={iconBg} alignItems="center" justifyContent="center" flexShrink={0} color={iconColor}>
            {icon}
        </Flex>
        <Box overflow="hidden">
            <Text fontSize="xs" color="slate.400" fontWeight="medium">{label}</Text>
            <Text fontSize="sm" fontWeight="semibold" color="slate.700" truncate>{value}</Text>
        </Box>
    </Flex>
);

const ReadOnlyField = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <Box>
        <Text fontSize="xs" fontWeight="bold" color="slate.400" textTransform="uppercase" letterSpacing="wider" mb="2">{label}</Text>
        <Box position="relative">
            <input
                type="text"
                value={value}
                readOnly
                style={{
                    width: "100%",
                    padding: "12px 16px 12px 44px",
                    backgroundColor: "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    fontSize: "14px",
                    outline: "none",
                    color: "#1e293b",
                    fontWeight: 500,
                    cursor: "not-allowed",
                }}
            />
            <Box position="absolute" left="14px" top="50%" transform="translateY(-50%)" color="slate.400">
                {icon}
            </Box>
        </Box>
    </Box>
);

export default ProfilePage;
