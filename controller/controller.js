exports.postRequests = (req, res) => {
    console.log(req.body);
    const { data, file_b64 } = req.body;
    const result = processBase64(file_b64);

    // Filter out numbers and alphabets
    const numbers = data.filter((item) => !isNaN(Number(item))).map(Number);
    const alphabets = data.filter((item) => isNaN(Number(item)));

    const lowercaseAlphabets = alphabets.filter((char) => char >= 'a' && char <= 'z');
    const highestLowercase = lowercaseAlphabets.length > 0
        ? lowercaseAlphabets.sort((a, b) => b.localeCompare(a))[0]
        : null;

    // Check if any number in `numbers` is prime
    const isPrimeFound = numbers.some(num => isPrime(num)); // Check if any number is prime

    const response = {
        is_success: true,
        user_id: "zaheer_0011",
        email: "zaheer286khan@gmail.com",
        roll_number: "0101CS211136",
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: [highestLowercase],
        is_prime_found: isPrimeFound, // This now correctly shows true/false based on prime numbers
        file_valid: result.isValid,
    };

    // Add conditional keys if `result.isValid` is true
    if (result.isValid) {
        response.file_mime_type = result.fileType;
        response.file_size_kb = result.size / 1024; // Convert size to KB
    } 

    res.status(200).json(response);
};

// Prime number checking function
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};


function processBase64(base64String) {
    try {
      // Step 1: Check if the string is valid base64
      const isValidBase64 = (str) => {
        try {
          atob(str); // Decode the base64 string
          return true;
        } catch (error) {
          return false;
        }
      };
  
      if (!isValidBase64(base64String)) {
        return {
          isValid: false,
          size: null,
          fileType: null,
          message: "Invalid Base64 string",
        };
      }
  
      // Step 2: Decode base64 string
      const binaryData = atob(base64String);
  
      // Step 3: Calculate file size in bytes
      const fileSize = binaryData.length; // Each character in binaryData represents a byte
  
      // Step 4: Extract file type (if MIME information is provided in the base64 string)
      const typeMatch = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      const fileType = typeMatch ? typeMatch[1] : "unknown";
  
      return {
        isValid: true,
        size: fileSize,
        fileType: fileType,
      };
    } catch (error) {
      return {
        isValid: false,
        size: null,
        fileType: null,
        message: "An error occurred while processing the file",
      };
    }
  }

exports.getRequests = (req,res)=>{

res.status(200).json({"operation_code":1})
  }