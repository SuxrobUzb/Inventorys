import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Textarea,
  VStack,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/apiClient';
import { useSnackbar } from 'notistack';
import { FaPlus, FaTrash } from 'react-icons/fa';

const AddItem = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const initialPrice = '0.00';
  const [values, setValues] = useState({
    product_name: '',
    price: initialPrice,
    description: '',
    inventory_numbers: [],
  });

  const handleAddInventoryNumber = () => {
    setValues({
      ...values,
      inventory_numbers: [...values.inventory_numbers, ''],
    });
  };

  const handleInventoryNumberChange = (index, value) => {
    const updatedNumbers = [...values.inventory_numbers];
    updatedNumbers[index] = value;
    setValues({ ...values, inventory_numbers: updatedNumbers });
  };

  const handleRemoveInventoryNumber = (index) => {
    const updatedNumbers = values.inventory_numbers.filter((_, i) => i !== index);
    setValues({ ...values, inventory_numbers: updatedNumbers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.inventory_numbers.some((num) => !num.trim())) {
      enqueueSnackbar('All inventory numbers must be filled!', { variant: 'error' });
      return;
    }

    try {
      const response = await axiosInstance.post('inventory/', {
        product_name: values.product_name,
        price: values.price,
        description: values.description,
        inventory_numbers: values.inventory_numbers,
      });
      enqueueSnackbar('Item Added!', { variant: 'success' });
      setValues({
        product_name: '',
        price: initialPrice,
        description: '',
        inventory_numbers: [],
      });
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Add: Something went wrong!', { variant: 'error' });
      console.error(error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <Box p="20px" mx="auto">
      <Box bg="whiteAlpha.700" maxW="100%" borderRadius={5}>
        <Box maxW="xl" bg="whiteAlpha.500" p="10px" borderRadius={5}>
          <form onSubmit={handleSubmit}>
            <Text fontSize="30px" as="b" padding={10}>
              New Item
            </Text>
            <VStack p={10} spacing={8}>
              {/* Product Name */}
              <FormControl id="product_name" isRequired>
                <FormLabel fontSize="18px">Product Name</FormLabel>
                <Input
                  borderColor="gray.400"
                  type="text"
                  value={values.product_name}
                  name="product_name"
                  size="lg"
                  onChange={(e) =>
                    setValues({ ...values, product_name: e.target.value })
                  }
                />
              </FormControl>

              {/* Price */}
              <FormControl id="price" isRequired>
                <FormLabel fontSize="18px">Price</FormLabel>
                <NumberInput
                  borderColor="gray.400"
                  value={values.price}
                  onChange={(valueAsString) =>
                    setValues({ ...values, price: valueAsString })
                  }
                  min={0}
                  step={0.01}
                  precision={2}
                  size="lg"
                  name="price"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              {/* Inventory Numbers */}
              <FormControl id="inventory_numbers" isRequired>
                <FormLabel fontSize="18px">Inventory Numbers</FormLabel>
                {values.inventory_numbers.map((number, index) => (
                  <Flex key={index} mb={2} alignItems="center">
                    <Input
                      borderColor="gray.400"
                      value={number}
                      onChange={(e) =>
                        handleInventoryNumberChange(index, e.target.value)
                      }
                      placeholder={`Inventory Number ${index + 1}`}
                      mr={2}
                    />
                    <IconButton
                      icon={<FaTrash />}
                      colorScheme="red"
                      onClick={() => handleRemoveInventoryNumber(index)}
                    />
                  </Flex>
                ))}
                <Button
                  leftIcon={<FaPlus />}
                  colorScheme="green"
                  onClick={handleAddInventoryNumber}
                  mt={2}
                >
                  Add Inventory Number
                </Button>
              </FormControl>

              {/* Description */}
              <FormControl id="description">
                <FormLabel fontSize="18px">Description</FormLabel>
                <Textarea
                  borderColor="gray.400"
                  name="description"
                  value={values.description}
                  onChange={(e) =>
                    setValues({ ...values, description: e.target.value })
                  }
                />
              </FormControl>

              {/* Buttons */}
              <HStack
                display="flex"
                justifyContent="flex-end"
                width="100%"
                spacing={5}
              >
                <Button size="md" type="submit" colorScheme="green">
                  Save
                </Button>
                <Button
                  size="md"
                  p={3}
                  colorScheme="red"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default AddItem;