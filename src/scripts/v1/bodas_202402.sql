-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: bodas
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- DATABASE 
CREATE DATABASE `bodas` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
COMMIT;

--
-- Table structure for table `hijos`
--

DROP TABLE IF EXISTS `hijos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hijos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invitado_id` int DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipo_menu` enum('infantil','adulto') NOT NULL,
  `menu_especial` tinyint(1) NOT NULL,
  `menu_especial_tipo` enum('vegetariano','celiaco','otro') DEFAULT NULL,
  `menu_especial_tipo_otro` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `invitado_id_idx` (`invitado_id`),
  CONSTRAINT `hijos_ibfk_1` FOREIGN KEY (`invitado_id`) REFERENCES `invitados` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
COMMIT;

--
-- Table structure for table `invitados`
--

DROP TABLE IF EXISTS `invitados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invitados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `menu_principal_tipo` enum('estandar','especial') NOT NULL,
  `menu_principal_tipo_especial` enum('vegano','celiaco','otro') DEFAULT NULL,
  `menu_principal_tipo_otro` varchar(255) DEFAULT NULL,
  `acompanante` tinyint(1) NOT NULL,
  `nombre_acompanante` varchar(255) DEFAULT NULL,
  `menu_acompanante_tipo` enum('estandar','especial') DEFAULT NULL,
  `menu_acompanante_tipo_especial` enum('vegano','celiaco','otro') DEFAULT NULL,
  `menu_acompanante_tipo_otro` varchar(255) DEFAULT NULL,
  `hijos` int NOT NULL DEFAULT '0',
  `detalles_alergia_alimentaria` text,
  `telefono_contacto` varchar(20) DEFAULT NULL,
  `opcion_transporte` enum('bus','car') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
COMMIT;

--
-- Table structure for table `invitadosnoasistentes`
--

DROP TABLE IF EXISTS `invitadosnoasistentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invitadosnoasistentes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `razon` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `comentario` text,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
COMMIT;

--
-- Dumping routines for database 'bodas'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-12 19:22:08
