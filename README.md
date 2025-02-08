# Users & Posts Dashboard

## Overview
This Next.js application fetches and displays a list of user profiles and their related posts. The dashboard uses two placeholder APIs to simulate real user and post data. When a user is selected, the application fetches and displays their posts. The application implements sophisticated caching strategies to optimize performance and reduce API calls.

## Tech Stack
- **Next.js**: Framework for building the React application with server-side rendering.
- **React**: Library for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework to create responsive and modern designs.
- **React Query** (`@tanstack/react-query`): Library to manage server-state, data fetching, and caching in React applications.

## Caching Features
- **Query Caching**: Implementation of React Query's caching system with:
  - 5-minute cache lifetime (cacheTime)
  - 1-minute stale time before background refresh
  - Automatic background data updates
  - Prefetching for pagination
  
- **Cache Debug Tools**:
  - Built-in cache monitoring interface
  - Cache status visualization
  - Manual cache control options
  - Console logging for cache operations

- **Cache Control Options**:
  - Check current cache status
  - Force data refresh
  - Clear cache manually
  - Monitor cache updates

## Local Development

### Prerequisites
- Node.js 18+ 
- npm 9+
- Docker (optional)

### Installation Steps
```bash
# Clone repository
git clone https://github.com/joy095/dashboard.git
cd dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

## Docker Deployment

### Build Docker Image
```bash
# Build the Docker image
docker build -t users-posts-dashboard .

# Alternative build with BuildKit for better performance
DOCKER_BUILDKIT=1 docker build -t users-posts-dashboard .
```

### Run Docker Container
```bash
# Run the container
docker run -p 3000:3000 users-posts-dashboard

# Run in detached mode
docker run -d -p 3000:3000 --name users-dashboard users-posts-dashboard

# Stop the container
docker stop users-dashboard
```

### Docker Compose (Optional)
```bash
# If using docker-compose
docker-compose up -d
docker-compose down
```

## Approach and Design Rationale

### State Management & Caching
- **Chosen Approach**: React Query with enhanced caching
- **Rationale**: 
  - Efficient data fetching and caching
  - Built-in loading/error states
  - Automatic background refetching
  - Simplified API interaction
  - Optimized performance with intelligent caching
  - Reduced server load
  - Improved user experience

### Cache Implementation Details
1. **Query Caching**:
   - Configurable cache duration
   - Stale-while-revalidate pattern
   - Background data updates
   - Cache persistence options

2. **Debug Features**:
   - Cache monitoring interface
   - Operation logging
   - Status visualization
   - Manual controls

3. **Performance Optimization**:
   - Prefetching for pagination
   - Automatic garbage collection
   - Optimistic updates
   - Intelligent cache invalidation

### API Integration
- Uses JSONPlaceholder fake REST API
- Two primary endpoints:
  1. `/users` - Fetch user profiles
  2. `/posts` - Retrieve user-specific posts

## Additional Docker Tips
- Ensure Docker is installed and running
- Verify port 3000 is available
- Check Docker logs for troubleshooting:
  ```bash
  docker logs users-dashboard
  ```

## Potential Enhancements
- Add Docker multi-stage builds
- Implement container orchestration
- Create development and production Dockerfiles
- Add Docker health checks
- Enhance caching strategies for specific use cases
- Implement service worker caching
- Add offline support with cached data

## Cache Monitoring and Debugging
To monitor the cache:
1. Open browser developer tools (F12)
2. Check the console for cache operation logs
3. Use the built-in cache control interface
4. Monitor network requests to verify caching

## Troubleshooting
- Verify Docker installation
- Check container logs
- Ensure consistent network connection
- Monitor cache status and operations
- Clear cache if data appears stale

## Cache-Related Commands
```bash
# Clear application cache
npm run clear-cache

# Check cache status
npm run check-cache

# Run with cache debugging enabled
DEBUG_CACHE=true npm run dev
```# dashboard
