import { useContext, useState } from 'react';
import {
  Box,
  FormControl,
  Input,
  Button,
  Heading,
  Center,
  chakra,
  InputGroup,
  InputLeftElement,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { AuthContext } from '../context/AuthWrapper.jsx';
import house from '../assets/home.png';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      return;
    }
    loginUser(formData);
  };

  return (
    <Center h="100vh">
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Flex>
          <Box color="gray.800">
            <Box maxW="35px" mb="-10px">
              <img src={house} alt="InveSTORE logo" />
            </Box>
            <Heading fontSize="50px">InveSTORE</Heading>
          </Box>
        </Flex>

        <Box
          minW={{ base: '90%', md: '468px' }}
          color="black"
          bg="whiteAlpha.900"
          p={8}
          borderWidth={1}
          borderRadius={8}
          boxShadow="lg"
        >
          <Box my={1} textAlign="left">
            <form onSubmit={handleSubmit}>
              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <CFaUserAlt color="gray.400" />
                  </InputLeftElement>
                  <Input
                    borderColor="gray.400"
                    color="black"
                    placeholder="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    _hover={{
                      borderColor: 'gray.500',
                      cursor: 'pointer',
                    }}
                  />
                </InputGroup>
              </FormControl>

              <FormControl isRequired mt={6}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <CFaLock color="gray.400" />
                  </InputLeftElement>
                  <Input
                    borderColor="gray.400"
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    _hover={{
                      borderColor: 'gray.500',
                      cursor: 'pointer',
                    }}
                  />
                </InputGroup>
              </FormControl>

              <Button
                width="full"
                bg="green.500"
                variant="solid"
                mt={4}
                type="submit"
                color="white"
                _hover={{
                  backgroundColor: 'green.600',
                  cursor: 'pointer',
                }}
                isDisabled={!formData.username || !formData.password}
              >
                Kirish
              </Button>
            </form>
          </Box>
        </Box>
      </Stack>
    </Center>
  );
};

export default Login;