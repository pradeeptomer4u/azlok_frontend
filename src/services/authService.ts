/**
 * Authentication service for Azlok frontend
 * Handles user authentication, registration, and related operations
 */

// Types
export interface UsernameAvailability {
  username: string;
  available: boolean;
  message: string;
}

/**
 * Check if a username is available for registration
 * @param username - The username to check
 * @returns Promise with availability information
 */
export const checkUsernameAvailability = async (username: string): Promise<UsernameAvailability> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/check-username/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error checking username availability: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Username availability check error:', error);
    // Return a default response in case of error
    return {
      username,
      available: false,
      message: 'Error checking username availability'
    };
  }
};

export default {
  checkUsernameAvailability,
};
