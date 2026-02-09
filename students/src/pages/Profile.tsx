import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, Input, Button, Image, Grid, GridItem } from '@chakra-ui/react';
import { Camera, Edit2 } from 'lucide-react';
import authService from '../services/authService';
import { StudentProfile } from '../services/types';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setProfile(storedUser.profile);
      setEmail(storedUser.email || '');
      setPhone(storedUser.phone || storedUser.profile?.phone || '');
    }
  }, []);

  const getNames = (fullName: string) => {
    const parts = fullName ? fullName.split(' ') : [];
    if (parts.length === 0) return { firstName: '', otherName: '' };
    return {
      firstName: parts[0],
      otherName: parts.slice(1).join(' ')
    };
  };

  const { firstName, otherName } = getNames(user?.fullName || '');

  // Mock fields if missing from API
  const mockAdmissionMode = 'UTME';
  const mockEntryQual = 'O-LEVEL';
  const mockDuration = 4;
  const mockDegree = 'B.SC';

  return (
    <Box p={{ base: 4, lg: 8 }} maxW="1600px" mx="auto">
      <Box 
        bg="white" 
        rounded={{ base: "24px", lg: "32px" }} 
        p={{ base: 6, lg: 10 }} 
        border="1px" 
        borderColor="gray.100" 
        shadow="sm"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={8} color="slate.800">Profile</Text>

        {/* Avatar Section */}
        <Flex align="center" gap={6} mb={10}>
          <Box position="relative">
            <Box 
              w="24" h="24" 
              rounded="full" 
              bg="gray.100" 
              border="1px solid" 
              borderColor="gray.200"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
               {user?.avatar ? (
                 <Image src={user.avatar} w="full" h="full" objectFit="cover" />
               ) : (
                <Camera size={32} color="#94a3b8" />
               )}
            </Box>
            <Box 
              position="absolute" 
              bottom={0} 
              right={0} 
              bg="white" 
              rounded="full" 
              p={1.5} 
              shadow="md" 
              border="1px solid" 
              borderColor="gray.100"
              cursor="pointer"
            >
              {/* <Edit2 size={12} color="#64748b" /> */}
            </Box>
          </Box>
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="slate.800">{user?.fullName || 'Student Name'}</Text>
            <Text fontSize="sm" color="gray.400">{user?.email || 'email@example.com'}</Text>
          </Box>
        </Flex>

        {/* Info Grid */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} mb={12}>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Reg No.</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.registrationNo || 'N/A'}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Mat No.</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.studentId || 'N/A'}</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">First Name</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{firstName}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Other Name</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{otherName}</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Sex</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.gender || 'N/A'}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Admission Mode</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.admissionMode || mockAdmissionMode}</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Entry Qualification</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.entryQualification || mockEntryQual}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Faculty Name</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{user?.faculty || 'COMPUTING'}</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Degree Course</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.degreeCourse || user?.department}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Department Name</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.Department?.name || user?.department}</Text>
            </Box>
          </GridItem>

          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Degree Awarded</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.degreeAwarded || mockDegree}</Text>
            </Box>
          </GridItem>
          <GridItem>
            <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Course Duration</Text>
            <Box bg="gray.100" rounded="lg" p={3}>
              <Text fontSize="sm" color="gray.500" fontWeight="medium">{profile?.courseDuration || mockDuration}</Text>
            </Box>
          </GridItem>
        </Grid>

        <Box w="full" h="1px" bg="gray.200" mb={8} />

        {/* Contact Edit Section */}
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8} mb={6}>
          <GridItem>
             <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Email Address</Text>
             <Input 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Enter address" 
               disabled={!isEditing}
               bg="white"
               borderColor="gray.200"
               _hover={{ borderColor: isEditing ? 'blue.400' : 'gray.200' }}
               _focus={{ borderColor: 'blue.500', ring: 1, ringColor: 'blue.500' }}
             />
          </GridItem>
          <GridItem>
             <Text fontSize="sm" fontWeight="semibold" mb={2} color="#1e293b">Phone Number</Text>
             <Input 
               value={phone}
               onChange={(e) => setPhone(e.target.value)}
               placeholder="Enter address" 
               disabled={!isEditing}
               bg="white"
               borderColor="gray.200"
                _hover={{ borderColor: isEditing ? 'blue.400' : 'gray.200' }}
                _focus={{ borderColor: 'blue.500', ring: 1, ringColor: 'blue.500' }}
             />
          </GridItem>
        </Grid>
        
        <Flex justify="flex-end">
            <Button 
                variant="outline" 
                size="md"
                rounded="lg"
                color="slate.600"
                borderColor="gray.200"
                leftIcon={<Edit2 size={16} />}
                onClick={() => setIsEditing(!isEditing)}
                _hover={{ bg: 'gray.50' }}
            >
                {isEditing ? 'Save' : 'Edit'}
            </Button>
        </Flex>

      </Box>
    </Box>
  );
};

export default Profile;
