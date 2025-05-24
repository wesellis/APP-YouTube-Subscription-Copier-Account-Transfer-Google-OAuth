# Contributing to YouTube Subscription Copier

Thank you for your interest in contributing to the YouTube Subscription Copier project! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and professional environment for all contributors.

## How to Contribute

### Reporting Issues

Before creating an issue, please:
1. Check if the issue has already been reported
2. Provide clear and detailed information about the problem
3. Include browser information and any error messages
4. Provide steps to reproduce the issue

### Suggesting Enhancements

We welcome suggestions for improvements! Please:
1. Check if the enhancement has already been suggested
2. Provide a clear description of the proposed feature
3. Explain why this enhancement would be useful
4. Consider the impact on existing functionality

### Pull Requests

1. **Fork the repository** and create your feature branch from `main`
2. **Write clear, descriptive commit messages**
3. **Test your changes** thoroughly
4. **Update documentation** as needed
5. **Follow JavaScript best practices**
6. **Ensure your code is properly commented**

## Development Guidelines

### JavaScript Standards
- Use ES6+ features when appropriate
- Follow consistent naming conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain consistent indentation (2 spaces)

### Code Style
- Use semicolons consistently
- Use single quotes for strings
- Keep lines under 100 characters when possible
- Use descriptive function and variable names

### Testing
- Test with different browsers (Chrome, Firefox, Safari, Edge)
- Verify functionality with different Google account configurations
- Test API rate limiting scenarios
- Ensure OAuth flow works correctly

## Development Setup

### Prerequisites
- Modern web browser
- Local HTTP server (Python, Node.js, or similar)
- Google Cloud Project with YouTube Data API enabled
- OAuth 2.0 client credentials

### Local Development
1. Fork and clone the repository
2. Set up Google Cloud project and OAuth credentials
3. Update `main.js` with your client ID
4. Start local HTTP server on port 8080
5. Test functionality with your YouTube accounts

## API Guidelines

### YouTube Data API
- Respect API quotas and rate limits
- Use efficient API calls to minimize quota usage
- Handle API errors gracefully
- Implement proper error messaging for users

### OAuth 2.0
- Follow security best practices
- Never expose client secrets in client-side code
- Handle token expiration properly
- Provide clear user feedback during auth flow

## Submission Guidelines

### Commit Messages
Use clear, descriptive commit messages:
```
Add feature for subscription filtering

- Implement client-side filtering by channel name
- Add search functionality to subscription list
- Update UI with filter controls
```

### Pull Request Process
1. Update documentation if needed
2. Ensure code follows style guidelines
3. Test thoroughly before submitting
4. Provide clear description of changes
5. Reference any related issues

## Feature Requests

### High Priority Features
- Subscription filtering and search
- Bulk subscription management
- Export/import functionality
- Enhanced error handling and recovery

### Nice-to-Have Features
- Dark mode support
- Subscription analytics
- Multiple account management
- Browser extension version

## Security Considerations

### Client-Side Security
- Never store sensitive data in localStorage
- Validate all user inputs
- Handle API responses securely
- Follow OAuth security best practices

### API Security
- Use HTTPS for all API calls
- Implement proper CORS handling
- Handle authentication errors gracefully
- Respect Google's API terms of service

## Testing Guidelines

### Manual Testing
- Test with multiple Google accounts
- Verify functionality across different browsers
- Test edge cases (empty subscription lists, network errors)
- Validate OAuth flow with various account states

### Error Scenarios
- API quota exhaustion
- Network connectivity issues
- Invalid authentication tokens
- Large subscription lists

## Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Explain API integration points
- Include usage examples

### User Documentation
- Keep README.md updated
- Provide clear setup instructions
- Include troubleshooting guide
- Add screenshots for complex steps

## Recognition

Contributors will be acknowledged in the project documentation and release notes.

## Questions?

If you have questions about contributing, please:
- Open an issue with the "question" label
- Contact Wesley Ellis at wes@wesellis.com

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project.

Thank you for contributing to YouTube Subscription Copier!