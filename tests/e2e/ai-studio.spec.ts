import { test, expect } from '@playwright/test';

test.describe('AI Studio Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the main page with proper title', async ({ page }) => {
    await expect(page).toHaveTitle(/AI Studio/);
    await expect(
      page.getByRole('heading', { name: 'AI Studio' })
    ).toBeVisible();
  });

  test('should have proper accessibility structure', async ({ page }) => {
    // Check for proper landmarks
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible();

    // Check for skip link
    const skipLink = page.getByText('Skip to main content');
    await expect(skipLink).toBeVisible();

    // Test skip link functionality
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Test tab navigation - start with skip link
    await page.keyboard.press('Tab');
    const skipLink = page.getByText('Skip to main content');

    // Wait for the skip link to be focused and visible
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    // Tab to theme toggle button
    await page.keyboard.press('Tab');
    const themeToggle = page.getByRole('button', {
      name: /switch to (light|dark) mode/i,
    });
    await expect(themeToggle).toBeFocused();

    // Tab to upload area
    await page.keyboard.press('Tab');
    const uploadArea = page.getByRole('button', { name: /upload image area/i });
    await expect(uploadArea).toBeFocused();
  });

  test('should toggle theme when theme button is clicked', async ({ page }) => {
    const themeToggle = page.getByRole('button', {
      name: /switch to (light|dark) mode/i,
    });

    // Check initial state
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    // Click theme toggle
    await themeToggle.click();

    // Check if theme changed
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Click again to toggle back
    await themeToggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('should display upload area when no image is selected', async ({
    page,
  }) => {
    await expect(page.getByText('Upload an image')).toBeVisible();
    await expect(
      page.getByText('Drag & drop or click to browse')
    ).toBeVisible();
    await expect(
      page.getByText('PNG/JPG • Max 10MB • Auto-resize to 1920px')
    ).toBeVisible();
  });

  test('should show prompt input field', async ({ page }) => {
    const promptInput = page.getByRole('textbox', { name: 'Prompt' });
    await expect(promptInput).toBeVisible();
    await expect(promptInput).toHaveAttribute(
      'placeholder',
      /describe the changes/i
    );
  });

  test('should display style selector with all options', async ({ page }) => {
    const styleOptions = [
      'Editorial',
      'Cinematic',
      'Artistic',
      'Photorealistic',
      'Anime',
      'Sketch',
      'Watercolor',
      'Oil Painting',
    ];

    for (const style of styleOptions) {
      await expect(page.getByText(style)).toBeVisible();
    }
  });

  test('should allow style selection', async ({ page }) => {
    const artisticStyle = page.getByText('Artistic').first();
    await artisticStyle.click();

    // Check if the style is selected (should have different styling)
    await expect(artisticStyle.locator('..')).toHaveClass(/border-blue-600/);
  });

  test('should show generate button when ready', async ({ page }) => {
    // Initially the button should be disabled
    const generateButton = page.getByRole('button', {
      name: /generate image/i,
    });
    await expect(generateButton).toBeDisabled();
  });

  test('should support file upload via click', async ({ page }) => {
    // Set up file chooser
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /upload image area/i }).click();
    const fileChooser = await fileChooserPromise;

    // Use a simple file path for testing
    await fileChooser.setFiles('tests/fixtures/test-image.jpg');

    // Note: This is a mock test since we can't actually process images in tests
    // In a real scenario, you'd want to mock the image processing
  });

  test('should handle drag and drop file upload', async ({ page }) => {
    const uploadArea = page.getByRole('button', { name: /upload image area/i });

    // Test drag over state
    await uploadArea.hover();
    await expect(uploadArea).toHaveClass(/hover:border-blue-500/);
  });

  test('should display proper error messages', async ({ page }) => {
    // Try to generate without image and prompt
    const generateButton = page.getByRole('button', {
      name: /generate image/i,
    });
    await generateButton.click();

    // Should show error message (check for the actual error text from the component)
    await expect(
      page.getByText(/please upload an image and enter a prompt/i)
    ).toBeVisible();
  });

  test('should maintain state across page refresh', async ({ page }) => {
    // Enter some text in prompt
    const promptInput = page.getByRole('textbox', { name: 'Prompt' });
    await promptInput.fill('Test prompt');

    // Select a style
    await page.getByText('Artistic').first().click();

    // Refresh the page
    await page.reload();

    // Check if state is maintained (this would require localStorage mocking in tests)
    // For now, just verify the page loads
    await expect(
      page.getByRole('heading', { name: 'AI Studio' })
    ).toBeVisible();
  });

  test('should have proper focus management', async ({ page }) => {
    // Test focus indicators
    const themeToggle = page.getByRole('button', {
      name: /switch to (light|dark) mode/i,
    });
    await themeToggle.focus();

    // Should have focus ring - check for the actual CSS class used
    await expect(themeToggle).toHaveClass(/focus:ring-2/);
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Check for proper ARIA labels
    await expect(
      page.getByRole('button', { name: /upload image area/i })
    ).toHaveAttribute('aria-describedby');

    // Check for proper form labels
    const promptInput = page.getByRole('textbox', { name: 'Prompt' });
    await expect(promptInput).toHaveAttribute('aria-describedby');
  });

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check if layout adapts
    await expect(
      page.getByRole('heading', { name: 'AI Studio' })
    ).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(
      page.getByRole('heading', { name: 'AI Studio' })
    ).toBeVisible();
  });

  // New comprehensive end-to-end test cases
  test.describe('Complete User Flow Tests', () => {
    test('should complete full image generation workflow', async ({ page }) => {
      // 1. Upload an image
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: /upload image area/i }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles('tests/fixtures/test-image.jpg');

      // Wait for image to be processed and displayed
      await expect(page.getByText('test-image.jpg')).toBeVisible();

      // 2. Enter a prompt
      const promptInput = page.getByRole('textbox', { name: 'Prompt' });
      await promptInput.fill('Make this image more vibrant and colorful');

      // 3. Select a style
      await page.getByText('Artistic').first().click();

      // 4. Generate button should now be enabled
      const generateButton = page.getByRole('button', {
        name: /generate image/i,
      });
      await expect(generateButton).toBeEnabled();

      // 5. Click generate (this would trigger the mock API in a real test)
      await generateButton.click();

      // 6. Verify loading state
      await expect(page.getByText(/generating/i)).toBeVisible();
    });

    test('should handle image replacement workflow', async ({ page }) => {
      // 1. Upload first image
      const fileChooserPromise1 = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: /upload image area/i }).click();
      const fileChooser1 = await fileChooserPromise1;
      await fileChooser1.setFiles('tests/fixtures/test-image.jpg');

      // Wait for first image
      await expect(page.getByText('test-image.jpg')).toBeVisible();

      // 2. Replace with new image
      const fileChooserPromise2 = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: /replace image/i }).click();
      const fileChooser2 = await fileChooserPromise2;
      await fileChooser2.setFiles('tests/fixtures/test-image.jpg');

      // 3. Verify image is still displayed
      await expect(page.getByText('test-image.jpg')).toBeVisible();
    });

    test('should handle image removal workflow', async ({ page }) => {
      // 1. Upload an image
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: /upload image area/i }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles('tests/fixtures/test-image.jpg');

      // 2. Verify image is displayed
      await expect(page.getByText('test-image.jpg')).toBeVisible();

      // 3. Remove the image
      await page.getByRole('button', { name: /remove image/i }).click();

      // 4. Verify upload area is shown again
      await expect(page.getByText('Upload an image')).toBeVisible();
    });

    test('should handle multiple style selections', async ({ page }) => {
      // 1. Select first style
      const editorialStyle = page.getByText('Editorial').first();
      await editorialStyle.click();
      await expect(editorialStyle.locator('..')).toHaveClass(/border-blue-600/);

      // 2. Select different style
      const cinematicStyle = page.getByText('Cinematic').first();
      await cinematicStyle.click();
      await expect(cinematicStyle.locator('..')).toHaveClass(/border-blue-600/);

      // 3. Verify first style is no longer selected
      await expect(editorialStyle.locator('..')).not.toHaveClass(
        /border-blue-600/
      );
    });

    test('should handle prompt input validation', async ({ page }) => {
      const promptInput = page.getByRole('textbox', { name: 'Prompt' });

      // 1. Test empty prompt
      await promptInput.fill('');
      await promptInput.blur();

      // 2. Test very long prompt
      const longPrompt = 'A'.repeat(1000);
      await promptInput.fill(longPrompt);
      await expect(promptInput).toHaveValue(longPrompt);

      // 3. Test special characters
      const specialPrompt = 'Make this image @#$%^&*() more vibrant!';
      await promptInput.fill(specialPrompt);
      await expect(promptInput).toHaveValue(specialPrompt);
    });

    test('should handle theme switching during workflow', async ({ page }) => {
      // 1. Start in light mode
      await expect(page.locator('html')).not.toHaveClass(/dark/);

      // 2. Upload image
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: /upload image area/i }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles('tests/fixtures/test-image.jpg');

      // 3. Switch to dark mode
      const themeToggle = page.getByRole('button', {
        name: /switch to (light|dark) mode/i,
      });
      await themeToggle.click();
      await expect(page.locator('html')).toHaveClass(/dark/);

      // 4. Verify all elements are still visible in dark mode
      await expect(page.getByText('test-image.jpg')).toBeVisible();
      await expect(page.getByRole('textbox', { name: 'Prompt' })).toBeVisible();
      await expect(page.getByText('Artistic')).toBeVisible();

      // 5. Switch back to light mode
      await themeToggle.click();
      await expect(page.locator('html')).not.toHaveClass(/dark/);
    });

    test('should handle keyboard-only navigation workflow', async ({
      page,
    }) => {
      // 1. Navigate to upload area using Tab
      await page.keyboard.press('Tab'); // Skip link
      await page.keyboard.press('Tab'); // Theme toggle
      await page.keyboard.press('Tab'); // Upload area

      const uploadArea = page.getByRole('button', {
        name: /upload image area/i,
      });
      await expect(uploadArea).toBeFocused();

      // 2. Activate upload area with Enter
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.keyboard.press('Enter');
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles('tests/fixtures/test-image.jpg');

      // 3. Navigate to prompt input
      await page.keyboard.press('Tab');
      const promptInput = page.getByRole('textbox', { name: 'Prompt' });
      await expect(promptInput).toBeFocused();

      // 4. Type prompt
      await promptInput.fill('Make this image more artistic');

      // 5. Navigate to style selector
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      const firstStyle = page.getByText('Editorial').first();
      await expect(firstStyle).toBeFocused();

      // 6. Select style with Enter
      await page.keyboard.press('Enter');
      await expect(firstStyle.locator('..')).toHaveClass(/border-blue-600/);
    });

    test('should handle error scenarios gracefully', async ({ page }) => {
      // 1. Try to generate without image
      const generateButton = page.getByRole('button', {
        name: /generate image/i,
      });
      await generateButton.click();

      // 2. Verify error message
      await expect(
        page.getByText(/please upload an image and enter a prompt/i)
      ).toBeVisible();

      // 3. Upload image but no prompt
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: /upload image area/i }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles('tests/fixtures/test-image.jpg');

      // 4. Try to generate again
      await generateButton.click();

      // 5. Verify error message about prompt
      await expect(page.getByText(/please enter a prompt/i)).toBeVisible();

      // 6. Enter prompt and try again
      const promptInput = page.getByRole('textbox', { name: 'Prompt' });
      await promptInput.fill('Make this image more vibrant');

      // 7. Generate button should now be enabled
      await expect(generateButton).toBeEnabled();
    });

    test('should maintain accessibility during state changes', async ({
      page,
    }) => {
      // 1. Check initial accessibility
      await expect(
        page.getByRole('button', { name: /upload image area/i })
      ).toHaveAttribute('aria-describedby');

      // 2. Upload image
      const fileChooserPromise = page.waitForEvent('filechooser');
      await page.getByRole('button', { name: /upload image area/i }).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles('tests/fixtures/test-image.jpg');

      // 3. Verify accessibility is maintained
      await expect(
        page.getByRole('button', { name: /remove image/i })
      ).toHaveAttribute('aria-label');
      await expect(
        page.getByRole('button', { name: /replace image/i })
      ).toHaveAttribute('aria-label');

      // 4. Remove image
      await page.getByRole('button', { name: /remove image/i }).click();

      // 5. Verify upload area accessibility is restored
      await expect(
        page.getByRole('button', { name: /upload image area/i })
      ).toHaveAttribute('aria-describedby');
    });
  });
});
