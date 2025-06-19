# Azure Deployment Guide for EduPlan Backend

This guide explains how to deploy the EduPlan backend to Azure App Service using the provided Azure DevOps pipeline.

## Pipeline Overview

The `azure-pipelines.yml` file contains a CI/CD pipeline that:

### Build Stage
1. **Node.js Setup**: Uses Node.js 18.x for building the application
2. **Dependency Installation**: Installs production dependencies using `npm ci --only=production`
3. **Package Preparation**: 
   - Copies source code, public files, migrations, and config to a deployment directory
   - Creates a `web.config` file for IIS configuration in Azure App Service
   - Creates a startup command file
4. **Artifact Creation**: Packages everything into a ZIP file for deployment

### Deploy Stage
1. **Azure Web App Deployment**: Deploys the packaged application to Azure App Service
2. **Environment Management**: Uses Azure DevOps environments for deployment control

## Prerequisites

### Azure Resources Required
1. **Azure App Service Plan**: Choose an appropriate plan (B1 or higher recommended)
2. **Azure App Service**: Web App for Node.js applications
3. **Azure Database for PostgreSQL**: For your database (if not using external database)
4. **Resource Group**: To organize your Azure resources

### Azure DevOps Setup
1. **Azure DevOps Project**: With repository access
2. **Service Connection**: Azure Resource Manager service connection
3. **Variable Groups**: For storing sensitive configuration

## App Service Configuration

### 1. Create Azure App Service

```bash
# Using Azure CLI
az group create --name eduplan-rg --location westeurope
az appservice plan create --name eduplan-plan --resource-group eduplan-rg --sku B1 --is-linux
az webapp create --name eduplan-backend --resource-group eduplan-rg --plan eduplan-plan --runtime "NODE|18-lts"
```

### 2. Configure App Service Settings

#### Application Settings (Environment Variables)
Configure these in Azure Portal → App Service → Configuration → Application settings:

```
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://your-frontend-domain.com

# Database Configuration
DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h

# Email Configuration (if using email features)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# Other Configuration
SESSION_SECRET=your-session-secret
```

#### General Settings
- **Stack**: Node.js 18 LTS
- **Platform**: Linux (recommended for Node.js)
- **Startup Command**: `node src/server.js`

### 3. Configure Startup Command

In Azure Portal → App Service → Configuration → General settings:
- **Startup Command**: `node src/server.js`

### 4. Enable Application Logs

In Azure Portal → App Service → Monitoring → Log stream:
- Enable Application Logging
- Set log level to Information

## Pipeline Variables Configuration

Configure these variables in Azure DevOps → Pipelines → Edit → Variables:

### Required Variables
- `AppServiceName`: Your Azure App Service name (e.g., `eduplan-backend`)
- `ResourceGroupName`: Your Azure Resource Group name (e.g., `eduplan-rg`)
- `AzureSubscription`: Your Azure service connection name

### Optional Variables
- `nodeVersion`: Node.js version (default: `18.x`)

## Database Configuration

### Option 1: Azure Database for PostgreSQL
```bash
# Create Azure PostgreSQL server
az postgres flexible-server create \
  --resource-group eduplan-rg \
  --name eduplan-db \
  --admin-user dbadmin \
  --admin-password YourPassword123! \
  --sku-name Standard_B1ms \
  --version 13
```

### Option 2: External Database
Use your existing PostgreSQL database and configure the connection string in App Service settings.

## Security Considerations

### 1. Environment Variables
- Store sensitive data in Azure Key Vault
- Use Azure App Service Key Vault references
- Never commit secrets to source control

### 2. CORS Configuration
- Configure CORS_ORIGIN to your frontend domain
- Use HTTPS in production

### 3. Database Security
- Use connection pooling
- Enable SSL for database connections
- Use managed identities when possible

## Monitoring and Logging

### 1. Application Insights
Enable Application Insights for:
- Performance monitoring
- Error tracking
- Usage analytics

### 2. Log Analytics
Configure Log Analytics workspace for:
- Centralized logging
- Custom queries
- Alerting

## Deployment Process

### 1. Initial Setup
1. Push the `azure-pipelines.yml` file to your main branch
2. Configure pipeline variables in Azure DevOps
3. Set up Azure service connection
4. Create the production environment

### 2. Deployment Triggers
- **Automatic**: Pipeline triggers on push to main branch
- **Manual**: Can be triggered manually from Azure DevOps

### 3. Deployment Validation
- Check deployment logs in Azure DevOps
- Verify application health at `https://your-app.azurewebsites.net/health`
- Test API endpoints

## Troubleshooting

### Common Issues

1. **Application Won't Start**
   - Check startup command in App Service configuration
   - Verify environment variables are set correctly
   - Check application logs in Azure Portal

2. **Database Connection Issues**
   - Verify database connection string
   - Check firewall rules for Azure PostgreSQL
   - Ensure SSL is configured properly

3. **CORS Errors**
   - Verify CORS_ORIGIN setting
   - Check if frontend domain is correct
   - Ensure HTTPS is used in production

4. **Memory Issues**
   - Monitor memory usage in Azure Portal
   - Consider upgrading App Service plan
   - Optimize Node.js memory settings

### Useful Commands

```bash
# Check App Service logs
az webapp log tail --name eduplan-backend --resource-group eduplan-rg

# Restart App Service
az webapp restart --name eduplan-backend --resource-group eduplan-rg

# Check App Service status
az webapp show --name eduplan-backend --resource-group eduplan-rg
```

## Cost Optimization

1. **App Service Plan**: Start with B1 plan, scale as needed
2. **Database**: Use Basic tier for development, Standard for production
3. **Monitoring**: Enable Application Insights for better insights
4. **Auto-scaling**: Configure auto-scaling rules for production workloads

## Next Steps

1. Set up custom domain and SSL certificate
2. Configure CDN for static assets
3. Set up staging environment for testing
4. Implement blue-green deployment strategy
5. Configure backup and disaster recovery

## Support

For issues with:
- **Azure Services**: Check Azure documentation and support
- **Pipeline**: Review Azure DevOps documentation
- **Application**: Check application logs and monitoring data 