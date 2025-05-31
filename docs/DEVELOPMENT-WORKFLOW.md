# ForexJoey Development Workflow

This document outlines the development workflow for ForexJoey, our AI-first, forex-only autonomous agent that prioritizes high-accuracy decision making.

## Branch Strategy

ForexJoey follows a branch-based development workflow to ensure stability and reliability:

### Main Branch (`main`)
- Represents the production-ready state of the application
- Always deployable to production environments
- Protected from direct pushes
- Changes only come through pull requests from the development branch
- Triggers automatic deployment to production environment

### Development Branch (`development`)
- Primary branch for ongoing development
- Features and fixes are developed here or in feature branches
- Must pass all tests before merging to main
- Deployable to staging/testing environment
- Used for integration testing before production

### Feature Branches (optional)
- Created from `development` for specific features or fixes
- Named with descriptive prefixes: `feature/`, `fix/`, `enhancement/`
- Merged back to `development` when complete
- Example: `feature/sentiment-analysis-integration`

## Development Workflow

1. **Start in Development**
   - Always work in the `development` branch or a feature branch
   ```bash
   git checkout development
   git pull origin development
   ```

2. **Create Feature Branch (optional for larger changes)**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Implement your changes
   - Ensure all changes align with ForexJoey's goal of high-accuracy decision making
   - Add proper documentation for AI components

4. **Test Your Changes**
   - Run local tests
   - Verify that at least 2 intelligence sources support any trading signals
   - Ensure explainability for all predictions

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "Descriptive message about your changes"
   ```

6. **Push to Remote**
   ```bash
   # If on development branch
   git push origin development
   
   # If on feature branch
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request (for feature branches)**
   - Create a pull request to merge your feature branch into `development`
   - Provide detailed description of changes
   - Reference any related issues

8. **Deployment to Production**
   - Once `development` is stable and tested:
   - Create a pull request from `development` to `main`
   - Review changes carefully
   - Merge to trigger production deployment

## Testing Requirements

ForexJoey requires rigorous testing due to its financial nature:

1. **Unit Tests**
   - Test individual components in isolation
   - Verify accuracy of technical indicators

2. **Integration Tests**
   - Test interaction between components
   - Verify data flow between intelligence sources

3. **Signal Validation**
   - Every trading signal must be backed by at least 2 intelligence sources
   - Validate against historical data when possible

4. **Explainability Check**
   - Ensure all predictions have human-readable explanations
   - Verify reflection mechanisms are working correctly

## Continuous Integration

- GitHub Actions will run tests on all pull requests
- Code quality checks ensure maintainability
- Performance benchmarks verify system efficiency

## Deployment Environments

- **Development**: Automatic deployment from `development` branch
- **Production**: Automatic deployment from `main` branch
- Both environments use Render for backend and Vercel for frontend

## Memory and Reflection

ForexJoey's continuous learning requires:

- Logging all trading decisions and outcomes
- Regular reflection on performance
- Adjustment of confidence levels based on historical accuracy
- Documentation of learned patterns and strategies

Remember that ForexJoey is not a general chatbot—its purpose is laser-focused on forex intelligence with high accuracy.
