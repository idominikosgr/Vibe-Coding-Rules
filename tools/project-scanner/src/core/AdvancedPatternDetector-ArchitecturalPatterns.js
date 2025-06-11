/**
 * AdvancedPatternDetector-ArchitecturalPatterns.js
 *
 * Implementation of architectural pattern detection methods for AdvancedPatternDetector.
 * This file will be imported and used by the main AdvancedPatternDetector.
 */

import fs from 'fs/promises';
import path from 'path';

/**
 * Detects architectural patterns in a project
 * @param {Object} projectStructure - Project structure data
 * @returns {Array} Detected architectural patterns
 */
export async function detectArchitecturalPatterns(projectStructure) {
  const patterns = [];
  
  // Get relevant data structures
  const { files, directories, fileTypes } = projectStructure;
  
  // Check for MVC pattern
  const mvcConfidence = detectMVCPattern(projectStructure);
  if (mvcConfidence > 0.7) {
    patterns.push({
      name: 'Model-View-Controller (MVC)',
      confidence: mvcConfidence,
      description: 'The codebase follows the Model-View-Controller architectural pattern.',
      locations: findMVCComponents(projectStructure)
    });
  }
  
  // Check for MVVM pattern
  const mvvmConfidence = detectMVVMPattern(projectStructure);
  if (mvvmConfidence > 0.7) {
    patterns.push({
      name: 'Model-View-ViewModel (MVVM)',
      confidence: mvvmConfidence,
      description: 'The codebase follows the Model-View-ViewModel architectural pattern.',
      locations: findMVVMComponents(projectStructure)
    });
  }
  
  // Check for Clean Architecture
  const cleanArchConfidence = detectCleanArchitecture(projectStructure);
  if (cleanArchConfidence > 0.7) {
    patterns.push({
      name: 'Clean Architecture',
      confidence: cleanArchConfidence,
      description: 'The codebase follows Clean Architecture principles with separated layers.',
      locations: findCleanArchComponents(projectStructure)
    });
  }
  
  // Check for Microservices architecture
  const microservicesConfidence = detectMicroservices(projectStructure);
  if (microservicesConfidence > 0.7) {
    patterns.push({
      name: 'Microservices',
      confidence: microservicesConfidence,
      description: 'The project follows a microservices architecture with separate services.',
      locations: findMicroserviceComponents(projectStructure)
    });
  }
  
  // Check for Hexagonal/Ports and Adapters architecture
  const hexagonalConfidence = detectHexagonalArchitecture(projectStructure);
  if (hexagonalConfidence > 0.7) {
    patterns.push({
      name: 'Hexagonal Architecture (Ports & Adapters)',
      confidence: hexagonalConfidence,
      description: 'The codebase implements a hexagonal architecture with clear ports and adapters.',
      locations: findHexagonalComponents(projectStructure)
    });
  }
  
  // Check for Event-Driven Architecture
  const eventDrivenConfidence = detectEventDrivenArchitecture(projectStructure);
  if (eventDrivenConfidence > 0.7) {
    patterns.push({
      name: 'Event-Driven Architecture',
      confidence: eventDrivenConfidence,
      description: 'The codebase uses event-driven patterns with publishers and subscribers.',
      locations: findEventDrivenComponents(projectStructure)
    });
  }
  
  return patterns;
}

/**
 * Detects whether the project follows an MVC architecture
 * @param {Object} projectStructure - The project structure data
 * @returns {number} Confidence score (0-1)
 */
function detectMVCPattern(projectStructure) {
  let score = 0;
  const { directories, files } = projectStructure;
  
  // Check for explicit MVC folders
  const dirNames = directories.map(dir => path.basename(dir).toLowerCase());
  const hasMvcFolders = 
    dirNames.includes('models') && 
    (dirNames.includes('views') || dirNames.includes('templates')) && 
    dirNames.includes('controllers');
  
  if (hasMvcFolders) {
    score += 0.6;
  }
  
  // Check for files that follow MVC naming conventions
  const fileNames = files.map(file => path.basename(file.path).toLowerCase());
  const modelFiles = fileNames.filter(name => name.includes('model'));
  const viewFiles = fileNames.filter(name => name.includes('view'));
  const controllerFiles = fileNames.filter(name => name.includes('controller'));
  
  if (modelFiles.length > 0 && viewFiles.length > 0 && controllerFiles.length > 0) {
    score += 0.3;
  }
  
  // Check for explicit framework that uses MVC
  const hasMvcFramework = checkForMvcFrameworks(projectStructure);
  if (hasMvcFramework) {
    score += 0.2;
  }
  
  // Cap at 1.0
  return Math.min(score, 1.0);
}

/**
 * Detects whether the project follows an MVVM architecture
 * @param {Object} projectStructure - The project structure data
 * @returns {number} Confidence score (0-1)
 */
function detectMVVMPattern(projectStructure) {
  let score = 0;
  const { directories, files } = projectStructure;
  
  // Check for explicit MVVM folders
  const dirNames = directories.map(dir => path.basename(dir).toLowerCase());
  const hasMvvmFolders = 
    dirNames.includes('models') && 
    (dirNames.includes('views') || dirNames.includes('templates')) && 
    (dirNames.includes('viewmodels') || dirNames.includes('view-models'));
  
  if (hasMvvmFolders) {
    score += 0.6;
  }
  
  // Check for files that follow MVVM naming conventions
  const fileNames = files.map(file => path.basename(file.path).toLowerCase());
  const modelFiles = fileNames.filter(name => name.includes('model'));
  const viewFiles = fileNames.filter(name => name.includes('view'));
  const viewModelFiles = fileNames.filter(name => 
    name.includes('viewmodel') || name.includes('view-model') || name.includes('vm'));
  
  if (modelFiles.length > 0 && viewFiles.length > 0 && viewModelFiles.length > 0) {
    score += 0.3;
  }
  
  // Check for explicit framework that uses MVVM
  const hasMvvmFramework = checkForMvvmFrameworks(projectStructure);
  if (hasMvvmFramework) {
    score += 0.2;
  }
  
  // Cap at 1.0
  return Math.min(score, 1.0);
}

/**
 * Detects whether the project follows Clean Architecture
 * @param {Object} projectStructure - The project structure data
 * @returns {number} Confidence score (0-1)
 */
function detectCleanArchitecture(projectStructure) {
  let score = 0;
  const { directories } = projectStructure;
  const dirNames = directories.map(dir => path.basename(dir).toLowerCase());
  
  // Check for Clean Architecture layers
  const hasEntities = dirNames.includes('entities') || dirNames.includes('domain');
  const hasUseCases = dirNames.includes('usecases') || dirNames.includes('use-cases') || 
                     dirNames.includes('interactors') || dirNames.includes('application');
  const hasAdapters = dirNames.includes('adapters') || dirNames.includes('interfaces');
  const hasFrameworks = dirNames.includes('frameworks') || dirNames.includes('infrastructure');
  
  if (hasEntities) score += 0.25;
  if (hasUseCases) score += 0.25;
  if (hasAdapters) score += 0.25;
  if (hasFrameworks) score += 0.25;
  
  return score;
}

/**
 * Detects whether the project follows a microservices architecture
 * @param {Object} projectStructure - The project structure data
 * @returns {number} Confidence score (0-1)
 */
function detectMicroservices(projectStructure) {
  let score = 0;
  const { directories, files } = projectStructure;
  
  // Check for service directories
  const serviceDirectories = directories.filter(dir => {
    const name = path.basename(dir).toLowerCase();
    return name.includes('service') || name.endsWith('-svc');
  });
  
  if (serviceDirectories.length >= 2) {
    score += 0.4;
  } else if (serviceDirectories.length === 1) {
    score += 0.2;
  }
  
  // Check for common microservice files
  const hasDockerfnile = files.some(file => path.basename(file.path) === 'Dockerfile');
  const hasDockerCompose = files.some(file => path.basename(file.path) === 'docker-compose.yml');
  const hasK8s = files.some(file => file.path.includes('kubernetes') || file.path.endsWith('.yaml'));
  const hasApiGateway = files.some(file => file.path.includes('gateway') || file.path.includes('proxy'));
  
  if (hasDockerfnile) score += 0.15;
  if (hasDockerCompose) score += 0.15;
  if (hasK8s) score += 0.15;
  if (hasApiGateway) score += 0.15;
  
  return Math.min(score, 1.0);
}

/**
 * Detects whether the project follows a Hexagonal/Ports and Adapters architecture
 * @param {Object} projectStructure - The project structure data
 * @returns {number} Confidence score (0-1)
 */
function detectHexagonalArchitecture(projectStructure) {
  let score = 0;
  const { directories, files } = projectStructure;
  const dirNames = directories.map(dir => path.basename(dir).toLowerCase());
  
  // Check for hexagonal architecture directories
  const hasDomain = dirNames.includes('domain');
  const hasPorts = dirNames.includes('ports');
  const hasAdapters = dirNames.includes('adapters');
  const hasInterfaces = dirNames.includes('interfaces');
  const hasInfrastructure = dirNames.includes('infrastructure');
  
  if (hasDomain) score += 0.2;
  if (hasPorts) score += 0.2;
  if (hasAdapters) score += 0.2;
  if (hasInterfaces || hasInfrastructure) score += 0.2;
  
  // Look for port/adapter patterns in file names
  const fileNames = files.map(file => path.basename(file.path).toLowerCase());
  const portFiles = fileNames.filter(name => name.includes('port'));
  const adapterFiles = fileNames.filter(name => name.includes('adapter'));
  
  if (portFiles.length > 0) score += 0.1;
  if (adapterFiles.length > 0) score += 0.1;
  
  return Math.min(score, 1.0);
}

/**
 * Detects whether the project follows an Event-Driven Architecture
 * @param {Object} projectStructure - The project structure data
 * @returns {number} Confidence score (0-1)
 */
function detectEventDrivenArchitecture(projectStructure) {
  let score = 0;
  const { directories, files } = projectStructure;
  
  // Check for event-driven directories
  const dirNames = directories.map(dir => path.basename(dir).toLowerCase());
  const hasEvents = dirNames.includes('events');
  const hasHandlers = dirNames.includes('handlers') || dirNames.includes('listeners');
  const hasPublishers = dirNames.includes('publishers') || dirNames.includes('dispatchers');
  const hasSubscribers = dirNames.includes('subscribers') || dirNames.includes('consumers');
  
  if (hasEvents) score += 0.2;
  if (hasHandlers) score += 0.2;
  if (hasPublishers) score += 0.2;
  if (hasSubscribers) score += 0.2;
  
  // Check for message broker configuration
  const hasBrokerConfig = files.some(file => {
    const name = path.basename(file.path).toLowerCase();
    return name.includes('kafka') || 
           name.includes('rabbitmq') || 
           name.includes('activemq') || 
           name.includes('eventbus');
  });
  
  if (hasBrokerConfig) score += 0.2;
  
  return Math.min(score, 1.0);
}

/**
 * Helper function to check for MVC frameworks in the project
 * @param {Object} projectStructure - The project structure data
 * @returns {boolean} True if an MVC framework is detected
 */
function checkForMvcFrameworks(projectStructure) {
  const { files } = projectStructure;
  const fileContents = files.map(file => file.path);
  
  // List of common MVC frameworks
  const mvcFrameworks = [
    'spring-webmvc', 'spring-mvc', '@angular/core', 'express', 
    'django', 'rails', 'laravel', 'asp.net mvc', 'flask'
  ];
  
  // Check for package files
  const packageJsonFiles = files.filter(file => path.basename(file.path) === 'package.json');
  const pyprojectFiles = files.filter(file => path.basename(file.path) === 'pyproject.toml');
  const gemfileFiles = files.filter(file => path.basename(file.path) === 'Gemfile');
  
  // TODO: Implement actual file content checking
  return false;
}

/**
 * Helper function to check for MVVM frameworks in the project
 * @param {Object} projectStructure - The project structure data
 * @returns {boolean} True if an MVVM framework is detected
 */
function checkForMvvmFrameworks(projectStructure) {
  const { files } = projectStructure;
  const fileContents = files.map(file => file.path);
  
  // List of common MVVM frameworks
  const mvvmFrameworks = [
    'knockout.js', 'vue', 'angularjs', 'wpf', 'androidx.lifecycle', 
    'androidx.viewmodel', 'reactiveui', 'mobx', 'rxswift'
  ];
  
  // Check for package files
  const packageJsonFiles = files.filter(file => path.basename(file.path) === 'package.json');
  
  // TODO: Implement actual file content checking
  return false;
}

/**
 * Finds MVC components in the project structure
 * @param {Object} projectStructure - The project structure data
 * @returns {Object} Component locations
 */
function findMVCComponents(projectStructure) {
  // Implementation will be added in a future version
  return {
    models: [],
    views: [],
    controllers: []
  };
}

/**
 * Finds MVVM components in the project structure
 * @param {Object} projectStructure - The project structure data
 * @returns {Object} Component locations
 */
function findMVVMComponents(projectStructure) {
  // Implementation will be added in a future version
  return {
    models: [],
    views: [],
    viewModels: []
  };
}

/**
 * Finds Clean Architecture components in the project structure
 * @param {Object} projectStructure - The project structure data
 * @returns {Object} Component locations
 */
function findCleanArchComponents(projectStructure) {
  // Implementation will be added in a future version
  return {
    entities: [],
    useCases: [],
    adapters: [],
    frameworks: []
  };
}

/**
 * Finds Microservice components in the project structure
 * @param {Object} projectStructure - The project structure data
 * @returns {Object} Component locations
 */
function findMicroserviceComponents(projectStructure) {
  // Implementation will be added in a future version
  return {
    services: [],
    infrastructure: [],
    gateway: []
  };
}

/**
 * Finds Hexagonal Architecture components in the project structure
 * @param {Object} projectStructure - The project structure data
 * @returns {Object} Component locations
 */
function findHexagonalComponents(projectStructure) {
  // Implementation will be added in a future version
  return {
    domain: [],
    ports: [],
    adapters: []
  };
}

/**
 * Finds Event-Driven Architecture components in the project structure
 * @param {Object} projectStructure - The project structure data
 * @returns {Object} Component locations
 */
function findEventDrivenComponents(projectStructure) {
  // Implementation will be added in a future version
  return {
    events: [],
    publishers: [],
    subscribers: []
  };
}
