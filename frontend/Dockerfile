FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-alpine AS base
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-alpine AS build
WORKDIR /src

COPY Frontend.csproj .
RUN dotnet restore Frontend.csproj

COPY . .
RUN dotnet build Frontend.csproj -c Release
RUN dotnet publish Frontend.csproj -c Release -o /dist

FROM base AS final
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT Production \
    ASPNETCORE_URLS http://+:80

COPY --from=build /dist .
ENTRYPOINT ["dotnet", "Frontend.dll"]
