-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Aug 27, 2026 at 01:11 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `car_rental_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `api_tokens`
--

CREATE TABLE `api_tokens` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int NOT NULL,
  `token_hash` varchar(64) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `api_tokens`
--

INSERT INTO `api_tokens` (`id`, `user_id`, `token_hash`, `expires_at`, `created_at`) VALUES
(1, 1, '585fb5f3e92af3f9416870ea91248e42bdd30a407cb522ffc1f22ced3aea1f8a', '2026-08-21 23:39:27', '2026-08-14 23:39:27'),
(2, 1, '54a37f90f45a83cf18816b942da529ce149beebbe1047c22482db15e7c36f3ea', '2026-08-21 23:44:21', '2026-08-14 23:44:21'),
(3, 1, '0f84a1319b11ee73bce476b7331ad3bb1a9251d56de60cd43c7ae9b061a870a3', '2026-08-22 00:57:31', '2026-08-15 00:57:31'),
(4, 1, '5218193a91f8e078cffb48f3d32d4b4b255f57f699bdb93b663e97a57ed00025', '2026-08-22 01:06:17', '2026-08-15 01:06:17'),
(5, 1, 'f8d85409043e7494043a27f75c6ae81a3510fbdd772a4005c7f4f56425a1cdb0', '2026-08-22 13:37:11', '2026-08-15 13:37:11'),
(6, 1, '2cf1d7ef9d2d53fbb243fff85e591814c608bb430c379085699e0fcd71ca52ab', '2026-08-22 14:41:25', '2026-08-15 14:41:25'),
(7, 1, 'c2d8e6b900a4d020b265651d5c634610c5569be52ad19b8878d765577570a10d', '2026-08-29 13:51:06', '2026-08-22 13:51:06'),
(8, 1, '36ee7a5b8f067e701b48b0d5ecfc34114d1a58a2cdf0ea1eb3240012e508746d', '2026-08-29 16:18:30', '2026-08-22 16:18:30'),
(9, 1, 'd40c0f632a24ebabb3b4eeb48023e66ef43dc51877045f26a0e0f78cc89a1595', '2026-08-29 16:28:02', '2026-08-22 16:28:02'),
(10, 3, '0996376414108e493ecf1432e19f3acad07d50620fb8cdcfae335c54b19cb80a', '2026-08-31 13:24:06', '2026-08-24 13:24:06'),
(11, 3, '49b6ae5f873996a1c6c8f80768fb1fd39db487cfea72def777e8e1de64fb7b57', '2026-08-31 13:52:22', '2026-08-24 13:52:22'),
(12, 1, 'dbd23e209ce4df86c4da40516ddeb5c3ac7f875c55907096c8e00014d039542d', '2026-08-31 13:52:29', '2026-08-24 13:52:29'),
(13, 3, '468893231e955cdd47ed555f70f2099b3f50c20058bfa0f2addca1bc986c2d22', '2026-08-31 13:59:26', '2026-08-24 13:59:26'),
(14, 1, 'd62f3cad284ff20aa59116169b94e2ffa13f769a99069b5f46949b6896b68714', '2026-08-31 13:59:50', '2026-08-24 13:59:50'),
(15, 1, 'd2266d7ec92ce56c8bc02d94ee6b7b6b82a802833a00963c9c4d39e1abd7213a', '2026-08-31 22:11:28', '2026-08-24 22:11:28'),
(16, 3, '346c68378dc81a4ca3ecfe4ef8c3df9257603e8232b7c1e878c2c069460a9ab1', '2026-08-31 22:13:12', '2026-08-24 22:13:12'),
(17, 1, '267ba29098210989fa25bb33fdd05a9a05cd1a0d7435eac56d99dbf566b1546a', '2026-08-31 22:13:36', '2026-08-24 22:13:36'),
(18, 3, 'b6a242697ea3b269bbdbfd5f7bd5df8414972cc0fe6a69762d5ef4ebaf46528e', '2026-08-31 22:42:46', '2026-08-24 22:42:46'),
(19, 1, 'a1a829b206d516eecd7a2572d2fce24800546c869895bf67a3cf23be99a72d1c', '2026-08-31 22:42:58', '2026-08-24 22:42:58'),
(20, 3, '1c8a3bdb71c9defb3bbd2a30d84721c9be839af2509300e12068de49b5992a41', '2026-08-31 22:51:13', '2026-08-24 22:51:13'),
(21, 1, '1501ca3e14eea08b8cef97655e7c20434848c3f761bd823b1324918275c802db', '2026-09-01 13:19:24', '2026-08-25 13:19:24'),
(22, 3, '3f6cf01c23b7fcb59f28f4ba00df7177ef41cde09eae12243165b9b9248b9a0d', '2026-09-01 13:30:58', '2026-08-25 13:30:58'),
(23, 1, '0147a8171d4e5ca723ae8c8384f80a5ec38991ab6e3d7f699a3fb46fcb2dc3a8', '2026-09-01 13:33:35', '2026-08-25 13:33:35'),
(24, 1, '022a9fabca6ff477877864416b00c2d71d2a4efa7f568c9a58128d6977df9be5', '2026-09-01 13:35:15', '2026-08-25 13:35:15'),
(25, 3, '0efdf7b3f8b5ddb5411edc1dc4c26de057bb1c279b92fdb4191ada124912d124', '2026-09-01 13:35:23', '2026-08-25 13:35:23'),
(26, 3, '164227579a7f612d689d56b40dfeacd0bf4c9db4ad47760a5af95e80ed0d4eaa', '2026-09-01 13:36:24', '2026-08-25 13:36:24'),
(27, 1, 'ce0979272a3e84b88e20edcb7ec36f16022b5e478ca16131d9a3e148bbd845b1', '2026-09-01 13:36:33', '2026-08-25 13:36:33'),
(28, 3, 'd7a2510d37844c46e9f75c977b0197b803578d4e7f1fc67d09babbb6ebc5328c', '2026-09-01 13:43:03', '2026-08-25 13:43:03'),
(29, 1, 'cdebc74bb5214f13845ccbac56a08a6cd835034272cb01c7a9c2b02e95db64cd', '2026-09-01 14:30:00', '2026-08-25 14:30:00'),
(30, 3, '36dd20212c1e30dc9ae67530629583e72072d0385f1c53ebd41794a95904d886', '2026-09-01 14:36:37', '2026-08-25 14:36:37'),
(31, 1, 'ef8495665c116b6ad9fb9aeb5febfedf1acd64fe50bf3b7c19e893badb093c09', '2026-09-01 14:37:42', '2026-08-25 14:37:42'),
(32, 3, '49a33cab0fceee3c67121252b963f70d1c221064dc12a8c5dc3480173f032d92', '2026-09-01 15:48:05', '2026-08-25 15:48:05'),
(33, 3, '7edf0bd30f10005ff8ba69f4550cb745862def76528cbfdcdedb1fc11d17173d', '2026-09-01 15:50:57', '2026-08-25 15:50:57'),
(34, 1, 'fc29c05dbda94b7f7dd8a689e24a51bbfe1876c9e1ffb9a20c4df204e582398c', '2026-09-01 15:51:05', '2026-08-25 15:51:05'),
(35, 3, '00fd1464cd627f1c6e4ef1c88bb8805152472a03fc49d7999394eb17bbe88709', '2026-09-01 15:52:23', '2026-08-25 15:52:23'),
(36, 1, 'f5f1e6e565d0683b06d6052f21d21d9d56f690026e475f44fc9fb009e1aa214f', '2026-09-01 15:52:34', '2026-08-25 15:52:34'),
(37, 3, 'e7cc70d7180a8da66148935d36b68762421111c34071b467c5e0be2a3fb0c3fe', '2026-09-01 15:53:43', '2026-08-25 15:53:43'),
(38, 1, '9e6c2d8ccdb42fc945ab1fed7eb1521f92fd59562d0da7c1b8396ce105511e2b', '2026-09-01 15:58:06', '2026-08-25 15:58:06'),
(39, 3, '471a0be646543d2b70733105da15960a6428a8152b5b4548059627a8686bb581', '2026-09-01 16:00:35', '2026-08-25 16:00:35'),
(40, 1, '6fe34ea52cb8102a9abbb22792026262a93e4b69c938474c1333a316321700a9', '2026-09-01 16:00:49', '2026-08-25 16:00:49'),
(41, 3, 'bfdd904633dac6d78d93b81c7c676311360e7b1e8c37b4f6f1234a3ad211ba4e', '2026-09-01 16:02:20', '2026-08-25 16:02:20'),
(42, 1, '271433ab2cd039c9e9a9f0ad9410121f10c2811679ef0ca90a7213ec844f0970', '2026-09-01 19:22:08', '2026-08-25 19:22:08'),
(43, 3, '208981b1b7711d7fc3abf5a2e6abfa597b44afe28acd2f7ced11c9d2374f1ef2', '2026-09-01 19:23:50', '2026-08-25 19:23:50'),
(44, 1, '65812470303bcca40834ced8f2695b644296fcd235bdb6fe748736b0e03e5857', '2026-09-02 16:23:03', '2026-08-26 16:23:03'),
(45, 1, '741a13475d45802758dd6b25b4160ce519dbcf998909223159179efe8ece0724', '2026-09-02 18:12:01', '2026-08-26 18:12:01'),
(46, 3, '90cd07534bd2cb906c31215f652ddab906dac8540671ea66e6ede4bdd2e62b12', '2026-09-02 18:13:47', '2026-08-26 18:13:47'),
(47, 3, 'dfbcdc4f67db1306c035403460283131feb6a7dc6ea3010af9405fc5ee61f196', '2026-09-02 20:10:20', '2026-08-26 20:10:20'),
(48, 3, '40c5f7941cd82d6537c4359c026ed6d25eb19e1d80777ccf07e8bf74f7eb6017', '2026-09-02 20:30:26', '2026-08-26 20:30:26'),
(49, 1, '2614c8fa9ba17af7c36d5815c9d4c763ae8a849348ff21cfe741519d3b4db7b8', '2026-09-02 20:33:47', '2026-08-26 20:33:47'),
(50, 3, '27d7d91f875aa835f7bdc766063231c7805e3ad2d8d022c72bb91fce79293fcc', '2026-09-02 20:47:37', '2026-08-26 20:47:37'),
(51, 1, 'f2ed8ed54a5156307dc1c6103bf598b84b453bc14ce1aff9e7f81788eeda87dd', '2026-09-02 20:49:41', '2026-08-26 20:49:41');

-- --------------------------------------------------------

--
-- Table structure for table `body_types`
--

CREATE TABLE `body_types` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `body_types`
--

INSERT INTO `body_types` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Sedan', 'active', '2026-08-15 22:30:50', '2026-08-15 22:30:50', NULL, NULL),
(2, 'SUV', 'active', '2026-08-15 22:30:50', '2026-08-15 22:30:50', NULL, NULL),
(3, 'Coupe', 'active', '2026-08-15 22:30:50', '2026-08-15 23:06:49', NULL, 1),
(4, 'Hatchback', 'active', '2026-08-15 22:30:50', '2026-08-15 22:30:50', NULL, NULL),
(8, 'Convertible', 'active', '2026-08-15 22:42:07', '2026-08-16 14:10:11', NULL, 1),
(11, 'dddddd', 'active', '2026-08-22 00:13:52', '2026-08-22 00:13:52', 1, 1),
(12, 'ccccc', 'active', '2026-08-22 00:13:56', '2026-08-22 00:13:56', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `borders`
--

CREATE TABLE `borders` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `borders`
--

INSERT INTO `borders` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Oman', 'active', '2026-08-17 15:39:43', '2026-08-17 15:39:43', NULL, NULL),
(2, 'Saudi Arabia', 'active', '2026-08-17 15:39:43', '2026-08-17 15:39:43', NULL, NULL),
(3, 'Qatar', 'active', '2026-08-17 15:45:22', '2026-08-17 15:49:07', 1, 1),
(4, 'Bahrain', 'active', '2026-08-17 15:49:17', '2026-08-17 15:49:17', 1, 1),
(6, 'Afghanistan', 'active', '2026-08-17 18:41:56', '2026-08-17 18:41:56', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `border_fees`
--

CREATE TABLE `border_fees` (
  `id` int UNSIGNED NOT NULL,
  `border_id` int UNSIGNED NOT NULL,
  `group_id` int UNSIGNED NOT NULL,
  `fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `border_fees`
--

INSERT INTO `border_fees` (`id`, `border_id`, `group_id`, `fee`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 1, 1, '75.00', '2026-08-17 18:01:04', '2026-08-17 18:01:04', 1, 1),
(3, 1, 7, '444.00', '2026-08-17 18:11:30', '2026-08-17 18:11:30', 1, 1),
(4, 6, 1, '324.00', '2026-08-17 18:41:57', '2026-08-17 18:41:57', 1, 1),
(5, 1, 2, '100.00', '2026-08-17 18:56:14', '2026-08-17 18:56:14', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `address` varchar(150) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `address`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Dubai', NULL, 'active', '2026-08-16 19:18:16', '2026-08-16 22:13:49', NULL, 1),
(2, 'Airport Branch', 'Dubai Airport - Terminal 2', 'active', '2026-08-16 19:18:16', '2026-08-17 15:39:43', NULL, NULL),
(3, 'Abu Dhabi', NULL, 'active', '2026-08-16 19:23:52', '2026-08-16 19:23:52', 1, 1),
(4, 'Sharjah', NULL, 'active', '2026-08-16 19:24:02', '2026-08-16 19:24:02', 1, 1),
(5, 'Al Ain', NULL, 'active', '2026-08-16 19:24:11', '2026-08-16 19:24:11', 1, 1),
(6, 'Ras Al Khaimah', NULL, 'active', '2026-08-16 19:24:20', '2026-08-16 19:24:20', 1, 1),
(7, 'Fujairah', NULL, 'active', '2026-08-16 19:24:28', '2026-08-16 19:24:28', 1, 1),
(8, 'Al Dhannah (Ruwais)', NULL, 'active', '2026-08-16 19:24:36', '2026-08-16 19:24:36', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `cars`
--

CREATE TABLE `cars` (
  `id` int NOT NULL,
  `model_id` int DEFAULT NULL,
  `plate_number` varchar(20) NOT NULL,
  `vin` varchar(30) DEFAULT NULL,
  `registration_number` varchar(50) DEFAULT NULL,
  `registration_expiry` date DEFAULT NULL,
  `year` year NOT NULL,
  `manufacture_year` int DEFAULT NULL,
  `color_id` int UNSIGNED DEFAULT NULL,
  `technical_status_id` int UNSIGNED DEFAULT NULL,
  `daily_rate` decimal(10,2) DEFAULT NULL,
  `monthly_rate` decimal(10,2) DEFAULT NULL,
  `status` enum('available','rented','maintenance','out_of_service') DEFAULT 'available',
  `location` varchar(100) DEFAULT NULL,
  `mileage` int DEFAULT '0',
  `fuel_level` enum('full','high','medium','low','empty') DEFAULT 'full',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`id`, `model_id`, `plate_number`, `vin`, `registration_number`, `registration_expiry`, `year`, `manufacture_year`, `color_id`, `technical_status_id`, `daily_rate`, `monthly_rate`, `status`, `location`, `mileage`, `fuel_level`, `created_at`, `updated_at`, `deleted_at`) VALUES
(1, 1, 'DUB-001', NULL, 'REG-10001', '2026-12-15', 2024, NULL, 1, NULL, '250.00', '5000.00', 'rented', NULL, 0, 'full', '2026-08-12 01:00:32', '2026-08-25 13:35:45', NULL),
(2, 2, 'DUB-002', 'VH-777702', 'REG-10002', '2026-09-05', 2024, NULL, 2, 5, '400.00', '10000.00', 'rented', NULL, 0, 'full', '2026-08-12 01:00:32', '2026-08-25 14:00:36', NULL),
(3, 3, 'DUB-003', NULL, 'REG-10003', '2027-03-20', 2022, NULL, 5, NULL, '150.00', '3500.00', 'rented', NULL, 0, 'full', '2026-08-12 01:00:32', '2026-08-26 20:49:23', NULL),
(4, 1, 'DUB-TEST', NULL, NULL, NULL, 2025, NULL, 3, NULL, '180.00', NULL, 'available', NULL, 0, 'full', '2026-08-15 15:03:52', '2026-08-18 11:11:25', '2026-08-15 15:06:19'),
(5, 4, 'DUB-004', NULL, '2027-03-20', NULL, 2023, NULL, 5, NULL, '500.04', NULL, 'rented', 'Air port', 2900, 'full', '2026-08-15 15:17:15', '2026-08-26 20:32:47', NULL),
(6, 2, 'DUB-TEST2', 'TESTVIN123', NULL, NULL, 2024, NULL, NULL, NULL, '300.00', NULL, 'available', NULL, 0, 'full', '2026-08-15 16:11:54', '2026-08-15 16:17:22', '2026-08-15 16:17:22'),
(7, 6, 'DUB-0010', 'VH-77280', '2027-03-20', '2026-08-28', 2022, NULL, 5, 5, '1200.00', NULL, 'rented', 'Air port', 50000, 'full', '2026-08-15 16:19:52', '2026-08-25 19:16:38', NULL),
(8, 7, 'DUB-23', 'W1K2060421F123456', NULL, NULL, 2024, NULL, 2, 5, '950.00', NULL, 'available', 'Air port', 100, 'full', '2026-08-18 10:39:12', '2026-08-22 14:15:41', NULL),
(9, 8, 'DUB-0044', 'VH-772802', 'REG-10301', '2024-01-01', 2024, 2024, 5, 5, '250.00', '6500.00', 'rented', 'Air port', 100000, 'full', '2026-08-22 14:54:19', '2026-08-25 14:37:23', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `car_groups`
--

CREATE TABLE `car_groups` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `car_groups`
--

INSERT INTO `car_groups` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Economy', 'active', '2026-08-15 22:30:50', '2026-08-17 15:59:00', NULL, 1),
(2, 'Compact', 'active', '2026-08-15 22:30:50', '2026-08-18 10:52:51', NULL, 1),
(3, 'Intermediate', 'active', '2026-08-15 22:30:50', '2026-08-18 10:50:15', NULL, 1),
(4, 'Full Size', 'active', '2026-08-15 22:30:50', '2026-08-18 10:53:03', NULL, 1),
(5, 'Luxury', 'active', '2026-08-15 22:30:50', '2026-08-15 22:30:50', NULL, NULL),
(7, 'vipv', 'active', '2026-08-15 22:30:50', '2026-08-18 10:51:38', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `car_models`
--

CREATE TABLE `car_models` (
  `id` int UNSIGNED NOT NULL,
  `make_id` int UNSIGNED DEFAULT NULL,
  `model_id` int UNSIGNED DEFAULT NULL,
  `body_type_id` int UNSIGNED DEFAULT NULL,
  `seats` tinyint UNSIGNED DEFAULT NULL,
  `fuel_type_id` int UNSIGNED DEFAULT NULL,
  `engine_capacity_id` int UNSIGNED DEFAULT NULL,
  `horsepower` int UNSIGNED DEFAULT NULL,
  `transmission_id` int UNSIGNED DEFAULT NULL,
  `group_id` int UNSIGNED DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `car_models`
--

INSERT INTO `car_models` (`id`, `make_id`, `model_id`, `body_type_id`, `seats`, `fuel_type_id`, `engine_capacity_id`, `horsepower`, `transmission_id`, `group_id`, `image_url`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 1, 6, 1, 5, 1, 10, 203, 1, 3, NULL, 'active', '2026-08-15 14:24:04', '2026-08-18 11:11:25', NULL, NULL),
(2, 3, 2, 2, 5, 1, 11, 335, 1, 4, NULL, 'active', '2026-08-15 14:24:04', '2026-08-18 11:11:25', NULL, NULL),
(3, 4, 3, 1, 5, 1, 12, 158, 1, 2, NULL, 'active', '2026-08-15 14:24:04', '2026-08-18 11:11:25', NULL, NULL),
(4, 2, 5, 2, 7, 1, 13, 400, NULL, 5, NULL, 'active', '2026-08-15 15:17:15', '2026-08-18 11:11:25', NULL, NULL),
(6, 5, 4, 1, 4, 1, 14, 400, 1, 5, NULL, 'active', '2026-08-15 16:19:52', '2026-08-18 11:11:25', NULL, NULL),
(7, 6, 9, 1, NULL, 1, 15, 204, 1, 5, NULL, 'active', '2026-08-18 10:39:12', '2026-08-18 11:11:25', 1, 1),
(8, 5, 11, 1, 4, 1, 10, 409, 1, 1, NULL, 'active', '2026-08-22 14:27:35', '2026-08-22 15:01:34', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `colors`
--

CREATE TABLE `colors` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `colors`
--

INSERT INTO `colors` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'White', 'active', '2026-08-18 11:11:25', '2026-08-18 11:11:25', NULL, NULL),
(2, 'Black', 'active', '2026-08-18 11:11:25', '2026-08-18 11:11:25', NULL, NULL),
(3, 'Silver', 'active', '2026-08-18 11:11:25', '2026-08-18 11:11:25', NULL, NULL),
(4, 'Gray', 'active', '2026-08-18 11:11:25', '2026-08-18 11:11:25', NULL, NULL),
(5, 'Red', 'active', '2026-08-18 11:11:25', '2026-08-18 11:11:25', NULL, NULL),
(6, 'Blue', 'active', '2026-08-18 11:11:25', '2026-08-18 11:11:25', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(10) NOT NULL,
  `label` varchar(50) DEFAULT NULL,
  `rate` decimal(10,4) NOT NULL DEFAULT '1.0000',
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`id`, `name`, `label`, `rate`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'AED', 'UAE Dirham', '1.0000', 'active', '2026-08-17 17:36:56', '2026-08-17 17:36:56', NULL, NULL),
(2, 'USD', 'US Dollar', '3.6725', 'active', '2026-08-17 17:36:56', '2026-08-17 17:36:56', NULL, NULL),
(3, 'EUR', 'Euro', '4.0000', 'active', '2026-08-17 17:36:56', '2026-08-17 17:36:56', NULL, NULL),
(4, 'GBP', 'British Pound', '4.6500', 'active', '2026-08-17 17:36:56', '2026-08-17 17:36:56', NULL, NULL),
(5, 'SAR', 'Saudi Riyal', '0.9800', 'active', '2026-08-17 17:36:56', '2026-08-17 17:36:56', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `id_type` varchar(30) DEFAULT NULL,
  `license_number` varchar(50) DEFAULT NULL,
  `license_type` varchar(30) DEFAULT NULL,
  `license_issue_date` date DEFAULT NULL,
  `license_expiry_date` date DEFAULT NULL,
  `national_id` varchar(50) DEFAULT NULL,
  `id_issue_date` date DEFAULT NULL,
  `id_expiry_date` date DEFAULT NULL,
  `nationality` varchar(60) NOT NULL DEFAULT 'Unknown',
  `gender` enum('male','female') DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `job` varchar(60) DEFAULT NULL,
  `address` text,
  `residential_no` varchar(50) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `address_1` varchar(150) DEFAULT NULL,
  `address_2` varchar(150) DEFAULT NULL,
  `license_type_id` int UNSIGNED DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `customer_type_id` int UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `phone`, `email`, `id_type`, `license_number`, `license_type`, `license_issue_date`, `license_expiry_date`, `national_id`, `id_issue_date`, `id_expiry_date`, `nationality`, `gender`, `birth_date`, `job`, `address`, `residential_no`, `postal_code`, `address_1`, `address_2`, `license_type_id`, `notes`, `created_at`, `updated_at`, `deleted_at`, `customer_type_id`) VALUES
(1, 'Ahmed Mohamed', '0501111111', 'ahmed.mohamed@example.com', NULL, 'DL-10001', NULL, NULL, NULL, '1001111111', NULL, NULL, 'Unknown', NULL, NULL, NULL, 'Downtown, Dubai', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-14 16:31:52', '2026-08-16 18:51:53', NULL, NULL),
(2, 'Fatima Ali', '0502222222', 'fatima.ali@example.com', NULL, 'DL-10002', NULL, NULL, NULL, '1002222222', NULL, NULL, 'Unknown', NULL, NULL, NULL, 'Al Barsha, Dubai', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-14 16:31:52', '2026-08-16 18:51:53', '2026-08-14 23:47:37', NULL),
(3, 'Omar Hassan', '0503333333', 'omar.hassan@example.com', NULL, 'DL-10003', NULL, NULL, NULL, '1003333333', NULL, NULL, 'Unknown', NULL, NULL, NULL, 'Deira, Dubai', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-14 16:31:52', '2026-08-16 18:51:53', NULL, NULL),
(4, 'Layla Ibrahim', '0504444444', 'layla.ibrahim@example.com', NULL, 'DL-10004', NULL, NULL, NULL, '1004444444', NULL, NULL, 'Unknown', NULL, NULL, NULL, 'Marina, Dubai', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-14 16:31:52', '2026-08-16 18:51:53', NULL, NULL),
(5, 'Khaalid Saeed', '0505555555', 'khalid.saeed@gmail.com', NULL, 'DL-100059', NULL, NULL, NULL, '1005555558', NULL, NULL, 'Unknown', NULL, NULL, NULL, 'Jumeirah, Dubai', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-14 16:31:52', '2026-08-16 18:51:53', NULL, NULL),
(6, 'Sara Ahmed', '0506666666', 'sara.ahmed@example.com', NULL, 'DL-10006', NULL, NULL, NULL, 'DL-10006', NULL, NULL, 'Unknown', NULL, NULL, NULL, 'Nasr City', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-14 20:22:54', '2026-08-16 18:51:53', '2026-08-14 21:01:11', NULL),
(7, 'saad', '01093837805', 'crash_1_1@hotmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, NULL, 'Nasr City', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-14 20:56:05', '2026-08-16 18:51:53', '2026-08-14 21:00:38', NULL),
(17, 'gogo', '01093837805', 'crash_1_1@hotmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, NULL, 'Nasr City', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-14 21:20:17', '2026-08-16 18:51:53', '2026-08-14 21:20:31', NULL),
(18, 'saad', '01093837805', 'crash_1_1@hotmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, NULL, 'Nasr City', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-14 21:20:26', '2026-08-16 18:51:53', '2026-08-14 21:20:56', NULL),
(19, 'saasd', '01093837805', 'crash_1_1@hotmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, NULL, 'Nasr City', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-14 21:31:10', '2026-08-16 18:51:53', '2026-08-14 21:31:22', NULL),
(20, 'saad', '01093837805', 'crash_1_1@hotmail.com', 'National ID', 'DL-1000622', 'International Permit', '2026-08-22', '2030-09-26', '76789876789', '2026-08-19', '2028-11-22', 'Egypt (EG)', 'male', '1997-02-12', 'UI/UX Designer', '8970 Hazelton-Etna Rd SW, Nasr City', '19', '25654', 'Nasr City', NULL, 6, 'Hello im tester', '2026-08-15 13:37:24', '2026-08-21 21:16:07', NULL, 1),
(21, 'saad', '01093837805', 'crash_1_1@hotmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Unknown', NULL, NULL, NULL, 'Nasr City', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-15 13:37:28', '2026-08-16 18:51:53', '2026-08-15 13:37:32', NULL),
(22, 'Test Legal', '0509998888', 'test@hotmail.com', 'Emirates ID', 'DL-99999', 'UAE Private', NULL, '2027-01-15', '784-1999-9999999-9', NULL, NULL, 'Egyptian', 'female', '2011-07-28', 'Officer', NULL, NULL, '11311', 'Nasr City', NULL, 1, NULL, '2026-08-16 18:16:45', '2026-08-21 21:43:28', NULL, 3),
(23, 'Nour Ahmed', '01093837805', 'crash_1_1@hotmail.com', 'Emirates ID', 'DL-4098059870', 'UAE Private', '2026-08-28', '2026-08-29', '223875985', '2026-08-20', '2026-08-13', 'Egypt (EG)', 'male', '2010-11-18', 'Designer', '34 North franklin street', '33', '11311', 'Nasr City', 'nasr city 02', 6, 'asfasfsf', '2026-08-16 18:25:00', '2026-08-25 15:59:32', NULL, 1),
(24, 'Gender Test', '0501112222', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Emirati', 'male', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-16 18:56:02', '2026-08-16 18:56:02', NULL, NULL),
(25, 'saad', '01093837805', 'crash_1_1@hotmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Egypt', NULL, NULL, NULL, 'Nasr City', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-18 14:49:37', '2026-08-18 14:49:37', NULL, NULL),
(26, 'ahmed foaad', '6745457', 'work.crash@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Saudi Arabia (SA)', 'male', '1987-02-11', 'Accounting', NULL, NULL, NULL, NULL, NULL, 4, NULL, '2026-08-18 15:46:59', '2026-08-21 21:24:05', NULL, 1),
(27, 'Sherif Mohamed', '9875643', 'shiko@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Egypt (EG)', 'female', '1984-09-12', 'Developer', NULL, NULL, NULL, NULL, NULL, 6, NULL, '2026-08-19 19:32:16', '2026-08-22 00:58:33', '2026-08-22 00:58:33', 3),
(28, 'Mohamed samy samy', '01093837555', 'm.samy@gmail.com', NULL, 'DL-7654234567', NULL, '2026-02-18', '2029-11-21', '5434556088021', '2023-02-01', '2033-02-01', 'Germany (DE)', 'male', '1990-02-13', 'Developer', 'Nasr City', '6', '11311', 'Nasr City', 'jksefm lado82', 4, '.akjsdjasgdyagsdnisa\nasdkjsahiduhsaiud\nsadkjhasiudh', '2026-08-20 13:53:47', '2026-08-22 00:28:08', NULL, 1),
(29, 'Test API', '0500000000', 't@t.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Egypt (EG)', 'male', '1990-01-01', 'Tester', 'X', NULL, NULL, NULL, NULL, NULL, NULL, '2026-08-22 01:08:02', '2026-08-22 01:08:02', NULL, 1),
(30, 'Noura Saad', '345798767867', 'n.saad@gmail.com', NULL, 'DL-8709876668', NULL, '2026-09-30', '2027-03-24', '8765458790', '2018-06-21', '2026-08-27', 'Cambodia (KH)', 'female', '1990-09-12', 'wfwef', NULL, '22', '11311', 'fffffffffffffff', 'ffffffffffff', 6, NULL, '2026-08-22 01:09:20', '2026-08-24 14:36:40', NULL, 3),
(31, 'Sherif Mohamed', '0106655890', 's.mohmed@gmail.com', NULL, 'DL-8765456789', NULL, '2021-02-02', '2031-02-02', '0109384678394223', '2020-07-15', '2030-07-15', 'Egypt (EG)', 'male', '1988-04-26', 'Developer', NULL, '22', '66700', '34 North franklin street', '34 North franklin street2', 5, NULL, '2026-08-25 14:34:03', '2026-08-25 15:45:34', NULL, 3),
(32, 'Mohamed saad', '01093837805', 'work.crash@gmail.com', NULL, 'ASL-9876543', NULL, '2020-10-13', '2030-10-13', '99874782373726', '2018-02-08', '2028-02-08', 'Egypt (EG)', 'male', '1984-09-12', 'Designer', NULL, '29', '11311', '22 Mohamed Ibrahem St, Nasr city', '22 Mohamed Ibrahem St, El Mokatam', 5, NULL, '2026-08-26 16:25:42', '2026-08-26 16:25:42', NULL, 3);

-- --------------------------------------------------------

--
-- Table structure for table `customer_types`
--

CREATE TABLE `customer_types` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `customer_types`
--

INSERT INTO `customer_types` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Social Media', 'active', '2026-08-19 12:55:21', '2026-08-20 13:54:29', NULL, 1),
(2, 'Facebook Users', 'active', '2026-08-19 12:55:21', '2026-08-20 13:54:36', NULL, 1),
(3, 'Tourist', 'active', '2026-08-19 12:55:21', '2026-08-19 12:55:21', NULL, NULL),
(5, 'Individual', 'active', '2026-08-20 13:54:48', '2026-08-20 13:54:48', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `engine_capacities`
--

CREATE TABLE `engine_capacities` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `engine_capacities`
--

INSERT INTO `engine_capacities` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(10, '2500 cc', 'active', '2026-08-18 11:11:25', '2026-08-18 11:18:29', NULL, 1),
(11, '3000 cc', 'active', '2026-08-18 11:11:25', '2026-08-18 11:18:32', NULL, 1),
(12, '1500 cc', 'active', '2026-08-18 11:11:25', '2026-08-18 11:18:37', NULL, 1),
(13, '5600 cc', 'active', '2026-08-18 11:11:25', '2026-08-18 11:18:41', NULL, 1),
(14, '3500 cc', 'active', '2026-08-18 11:11:25', '2026-08-18 11:18:35', NULL, 1),
(15, '1496 cc', 'active', '2026-08-18 11:11:25', '2026-08-18 11:18:44', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `fuel_types`
--

CREATE TABLE `fuel_types` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fuel_types`
--

INSERT INTO `fuel_types` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Petrol', 'active', '2026-08-15 22:30:50', '2026-08-15 22:30:50', NULL, NULL),
(2, 'Diesel', 'active', '2026-08-15 22:30:50', '2026-08-15 22:30:50', NULL, NULL),
(3, 'Electric', 'active', '2026-08-15 22:30:50', '2026-08-15 22:30:50', NULL, NULL),
(4, 'Hybrid', 'active', '2026-08-15 22:30:50', '2026-08-15 22:30:50', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `inspections`
--

CREATE TABLE `inspections` (
  `id` int NOT NULL,
  `rental_id` int NOT NULL,
  `inspection_type` enum('pickup','dropoff') NOT NULL,
  `inspector_id` int NOT NULL,
  `inspection_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `damage_report` json DEFAULT NULL,
  `photos` json DEFAULT NULL,
  `notes` text,
  `status` enum('pending','completed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `inspections`
--

INSERT INTO `inspections` (`id`, `rental_id`, `inspection_type`, `inspector_id`, `inspection_date`, `damage_report`, `photos`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'pickup', 3, '2026-08-25 16:35:45', '[]', '[]', NULL, 'completed', '2026-08-25 13:35:45', '2026-08-25 13:35:45'),
(2, 2, 'pickup', 3, '2026-08-25 17:00:36', '[{\"part\": \"wehth\", \"type\": \"Crack\", \"notes\": \"Choose from Luxury Cars, SUVs, Convertibles, Minivans &amp; more! Easy pickup and returns Our 12 locations in SIXT Cairo make renting a car hassle-free.\", \"severity\": \"Minor\"}]', '[]', NULL, 'completed', '2026-08-25 14:00:36', '2026-08-25 14:00:36'),
(3, 3, 'pickup', 3, '2026-08-25 17:37:23', '[{\"part\": \"lkhsanfguyf\", \"type\": \"Burn\", \"notes\": \"afhgayguyafgdqwas\\nafkjagdtbfaudytf\", \"severity\": \"Minor\"}]', '[]', NULL, 'completed', '2026-08-25 14:37:23', '2026-08-25 14:37:23'),
(4, 4, 'pickup', 3, '2026-08-25 18:50:25', '[{\"part\": \"liuynu\", \"type\": \"Collision\", \"notes\": \"posumiosyfiuysd\", \"photos\": [], \"severity\": \"Severe\"}, {\"part\": \"poiuiu9\", \"type\": \"Crack\", \"notes\": \";lkjhgffgo\\ndf\", \"photos\": [], \"severity\": \"Moderate\"}, {\"part\": \";lkjhgfdfghjk\", \"type\": \"Crack\", \"notes\": \"ffghsfdfjgfd\", \"photos\": [], \"severity\": \"Moderate\"}]', '[]', NULL, 'completed', '2026-08-25 15:50:25', '2026-08-25 15:50:25'),
(5, 5, 'pickup', 3, '2026-08-25 22:16:38', '[{\"part\": \"plkjhgffdghj\", \"type\": \"Scratch\", \"notes\": \"\", \"photos\": [], \"severity\": \"Minor\"}, {\"part\": \"fdtrdcrdctr\", \"type\": \"Collision\", \"notes\": \"/lkjfjnloinhpoipoinuoijmop.[p.k/lkjfjnloinhpoipoinuoijmop.[p.k/lkjfjnloinhpoipoinuoijmop.[p.k/lkjfjnloinhpoipoinuoijmop.[p.k/lkjfjnloinhpoipoinuoijmop.[p.k/lkjfjnloinhpoipoinuoijmop.[p.k/lkjfjnloinhpoipoinuoijmop.[p.k\", \"photos\": [\"data:image/jpeg;base64,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\"], \"severity\": \"Moderate\"}]', '[]', NULL, 'completed', '2026-08-25 19:16:38', '2026-08-25 19:16:38'),
(6, 6, 'pickup', 3, '2026-08-26 23:32:47', '[{\"part\": \"kjnijhniuhniooiiu\", \"type\": \"Crack\", \"notes\": \"111111111111111\", \"photos\": [\"data:application/octet-stream;base64,\"], \"severity\": \"Moderate\"}, {\"part\": \"lkj;lkjkljkl\", \"type\": \"Scratch\", \"notes\": \"kjhjhnioji\", \"photos\": [\"data:application/octet-stream;base64,\"], \"severity\": \"Moderate\"}]', '[]', NULL, 'completed', '2026-08-26 20:32:47', '2026-08-26 20:32:47');
INSERT INTO `inspections` (`id`, `rental_id`, `inspection_type`, `inspector_id`, `inspection_date`, `damage_report`, `photos`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(7, 7, 'pickup', 3, '2026-08-26 23:49:23', '[{\"part\": \"the first Damage 01\", \"type\": \"Scratch\", \"notes\": \"eeeeee\", \"photos\": [\"data:image/jpeg;base64,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PhX0DJ8oHyfydLcB0lbi2NGKbBnCmIwydXh1N3JcBdWv2eyWGxtzr54ovQe/YL5TOiuEi4GG4g8hw/EsQ84TDyfRxv14V9V19tNtddtCKpj6Z9BOGYHpHheHcXxUsnEcQ2LaSaByJJHN2VLIDYWHtW33NeD0UHv8XyjdE1+U3EcZ/pW3D34OmGE3zaXWQS5suXLfbntWk6F9OOBcI6HdF8BLimfH4PiZknw8eHdmCOZVuDaxNpAbA35V43WVwzGy8M4jheIYbL1+FmSaLMLgMrBhcc9RQfRDPwXF8F+ULifApMdMMbw93xEk8LRxhxDIMqBlB0Gp39pa+ba7vpB8q/Snj3DJeG4qbCw4Wdckww8WUuvdck2HlauEoCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCt90PXgs3FjF0iOXCPCxEpcgI62bWxB7QVk838L1oaKD0ZIPk+fGSKCqwIsMgJmlu4laUMgN94xLASbH9i2hub24XD/J3JI4nKwpHjnwwYYiUmSGMB+vtfTrMpjy/v6W3HmlFB2XCMH0a/obi8vFMXgnxjQlsJGkkwaBjC7qFOznPkjZWFhvm79/xWPoPi58finxWDeSbHx5TG8kZjiEkCsoUdllKGVr2BBGl+Xl1FB6RDh+hmJniTDcOSWQSxFYcLLPJJMvzmSNkAzXJ6kJJoB2j3HLWF/RXRvC9JsRhJsZgWw+FifCxCaWZUnxUaIGklK3IjZzJlysPZA0Gp4dJGjcPGzIwNwynUeRqL0HdJB0NjwWEnc4WWZYnYos84aVxhpGYSjTKBOI1TKQSpN771gdM4+jYhibo+sEbCd1dYppHzIYoWU9snZ2mUW5KL3IueSooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKAooooCiiigKKKKD/9k=\"], \"severity\": \"Minor\"}, {\"part\": \"The second damage 02\", \"type\": \"Crack\", \"notes\": \"hguhgiugnu\", \"photos\": [\"data:image/jpeg;base64,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\"], \"severity\": \"Moderate\"}]', '[]', NULL, 'completed', '2026-08-26 20:49:23', '2026-08-26 20:49:23');

-- --------------------------------------------------------

--
-- Table structure for table `km_policies`
--

CREATE TABLE `km_policies` (
  `id` int UNSIGNED NOT NULL,
  `rental_type_id` int UNSIGNED NOT NULL,
  `group_id` int UNSIGNED NOT NULL,
  `max_km` int NOT NULL DEFAULT '250',
  `extra_km_rate` decimal(10,2) NOT NULL DEFAULT '0.00',
  `unlimited_daily_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `km_policies`
--

INSERT INTO `km_policies` (`id`, `rental_type_id`, `group_id`, `max_km`, `extra_km_rate`, `unlimited_daily_amount`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 4, 2, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(2, 2, 2, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(3, 3, 2, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(4, 1, 2, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(5, 4, 1, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(6, 2, 1, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(7, 3, 1, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(8, 1, 1, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(9, 4, 4, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(10, 2, 4, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(11, 3, 4, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(12, 1, 4, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(13, 4, 3, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(14, 2, 3, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(15, 3, 3, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(16, 1, 3, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(17, 4, 5, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(18, 2, 5, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(19, 3, 5, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(20, 1, 5, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(21, 4, 7, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(22, 2, 7, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(23, 3, 7, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL),
(24, 1, 7, 250, '2.00', '50.00', 'active', '2026-08-22 15:20:53', '2026-08-22 15:20:53', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `license_types`
--

CREATE TABLE `license_types` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `license_types`
--

INSERT INTO `license_types` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'UAE Private', 'active', '2026-08-20 14:07:45', '2026-08-20 14:07:45', NULL, NULL),
(2, 'UAE Light Vehicle', 'active', '2026-08-20 14:07:45', '2026-08-20 14:07:45', NULL, NULL),
(3, 'UAE Heavy Vehicle', 'active', '2026-08-20 14:07:45', '2026-08-20 14:07:45', NULL, NULL),
(4, 'GCC License', 'active', '2026-08-20 14:07:45', '2026-08-20 14:07:45', NULL, NULL),
(5, 'International Permit', 'active', '2026-08-20 14:07:45', '2026-08-20 14:07:45', NULL, NULL),
(6, 'Motorcycle', 'active', '2026-08-20 14:07:45', '2026-08-20 14:07:45', NULL, NULL),
(7, 'Other', 'active', '2026-08-20 14:07:45', '2026-08-20 14:07:45', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Cash', 'active', '2026-08-17 17:21:02', '2026-08-17 17:21:02', NULL, NULL),
(2, 'Credit Card (Pre-Auth)', 'active', '2026-08-17 17:21:02', '2026-08-17 17:21:02', NULL, NULL),
(3, 'Bank Transfer', 'active', '2026-08-17 17:21:02', '2026-08-17 17:21:02', NULL, NULL),
(4, 'Apple Pay', 'active', '2026-08-17 17:21:02', '2026-08-17 17:21:02', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pricing_modes`
--

CREATE TABLE `pricing_modes` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pricing_modes`
--

INSERT INTO `pricing_modes` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Daily Standard', 'Standard daily pricing', 'active', '2026-08-22 01:46:50', '2026-08-22 01:46:50', NULL, NULL),
(2, 'Rack Rate', 'Published full rate', 'active', '2026-08-22 01:46:50', '2026-08-22 01:46:50', NULL, NULL),
(3, 'Weekly Saver', 'Discounted weekly pricing', 'active', '2026-08-22 01:46:50', '2026-08-22 01:46:50', NULL, NULL),
(4, 'Peak Season Rate', 'High-demand season pricing', 'active', '2026-08-22 01:46:50', '2026-08-22 01:46:50', NULL, NULL),
(5, 'Last Minute Deal', 'Short-notice promotional pricing', 'active', '2026-08-22 01:46:50', '2026-08-22 01:46:50', NULL, NULL),
(6, 'Weekend Special', 'Weekend promotional pricing', 'active', '2026-08-22 01:46:50', '2026-08-22 01:46:50', NULL, NULL),
(7, 'Unlimited Mileage', 'Includes unlimited kilometers', 'active', '2026-08-22 01:46:50', '2026-08-22 01:46:50', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `rentals`
--

CREATE TABLE `rentals` (
  `id` int NOT NULL,
  `booking_number` varchar(20) DEFAULT NULL,
  `contract_number` varchar(20) DEFAULT NULL,
  `rental_type` varchar(20) NOT NULL DEFAULT 'daily',
  `customer_id` int NOT NULL,
  `car_id` int NOT NULL,
  `with_driver` tinyint(1) NOT NULL DEFAULT '0',
  `staff_id` int NOT NULL,
  `updated_by` int DEFAULT NULL,
  `pickup_branch_id` int UNSIGNED DEFAULT NULL,
  `return_branch_id` int UNSIGNED DEFAULT NULL,
  `pickup_address` varchar(150) DEFAULT NULL,
  `dropoff_address` varchar(150) DEFAULT NULL,
  `hirer_source_id` int UNSIGNED DEFAULT NULL,
  `cross_border_id` int UNSIGNED DEFAULT NULL,
  `tariff_name` varchar(50) DEFAULT NULL,
  `pricing_mode` varchar(50) DEFAULT NULL,
  `rental_band` varchar(20) DEFAULT NULL,
  `units` int DEFAULT NULL,
  `rack_rate` decimal(10,2) DEFAULT NULL,
  `gross_amount` decimal(10,2) DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT NULL,
  `unlimited_addon` decimal(10,2) DEFAULT NULL,
  `border_fee` decimal(10,2) DEFAULT NULL,
  `vat_amount` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `km_policy` varchar(20) NOT NULL DEFAULT 'limited',
  `allowed_km` int DEFAULT NULL,
  `extra_km_fee` decimal(10,2) DEFAULT NULL,
  `actual_return_date` datetime DEFAULT NULL,
  `daily_rate` decimal(10,2) DEFAULT NULL,
  `monthly_rate` decimal(10,2) DEFAULT NULL,
  `initial_payment` decimal(10,2) DEFAULT NULL,
  `final_charges` decimal(10,2) DEFAULT '0.00',
  `security_deposit` decimal(10,2) DEFAULT NULL,
  `security_deposit_method_id` int UNSIGNED DEFAULT NULL,
  `deposit_received` tinyint(1) NOT NULL DEFAULT '0',
  `deposit_ref` varchar(50) DEFAULT NULL,
  `currency_id` int UNSIGNED DEFAULT NULL,
  `status` enum('booked','active','returned','completed','cancelled') DEFAULT 'booked',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rentals`
--

INSERT INTO `rentals` (`id`, `booking_number`, `contract_number`, `rental_type`, `customer_id`, `car_id`, `with_driver`, `staff_id`, `updated_by`, `pickup_branch_id`, `return_branch_id`, `pickup_address`, `dropoff_address`, `hirer_source_id`, `cross_border_id`, `tariff_name`, `pricing_mode`, `rental_band`, `units`, `rack_rate`, `gross_amount`, `discount_amount`, `unlimited_addon`, `border_fee`, `vat_amount`, `total_amount`, `start_date`, `end_date`, `km_policy`, `allowed_km`, `extra_km_fee`, `actual_return_date`, `daily_rate`, `monthly_rate`, `initial_payment`, `final_charges`, `security_deposit`, `security_deposit_method_id`, `deposit_received`, `deposit_ref`, `currency_id`, `status`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'BK-00001', 'CON-00001', 'daily', 28, 1, 0, 1, 3, 2, 2, 'Dubai Airport - Terminal 2', 'Dubai Airport - Terminal 2', 6, NULL, NULL, 'Daily Standard', 'Daily', 3, NULL, '750.00', '200.00', '0.00', '0.00', '27.50', '577.50', '2026-08-24 00:00:00', '2026-08-27 00:00:00', 'limited', 750, '2.00', NULL, '250.00', '5000.00', NULL, '0.00', '1000.00', 1, 1, 'TXN-82049723', 1, 'active', NULL, '2026-08-23 21:49:36', '2026-08-25 13:35:45'),
(2, 'BK-00002', 'CON-00002', 'daily', 30, 2, 0, 1, 3, 2, 2, 'Dubai Airport - Terminal 2', 'Dubai Airport - Terminal 2', 5, NULL, NULL, 'Daily Standard', 'Daily', 4, NULL, '1600.00', '100.00', '200.00', '0.00', '85.00', '1785.00', '2026-08-24 00:00:00', '2026-08-28 00:00:00', 'unlimited', 1000, '2.00', NULL, '400.00', '10000.00', NULL, '0.00', '1000.00', 1, 1, 'TXN-977677897553', 1, 'active', NULL, '2026-08-24 13:58:20', '2026-08-25 14:00:36'),
(3, 'BK-00003', 'CON-00003', 'daily', 31, 9, 0, 1, 3, 2, 2, 'Dubai Airport - Terminal 2', 'Dubai Airport - Terminal 2', 6, 1, 'Standard', 'Daily Standard', 'Daily', 3, '250.00', '750.00', '150.00', '0.00', '75.00', '33.75', '708.75', '2026-08-25 00:00:00', '2026-08-28 00:00:00', 'limited', 750, '2.00', NULL, '250.00', '6500.00', NULL, '0.00', '1000.00', 1, 1, 'TNX-87543', 2, 'active', NULL, '2026-08-25 14:36:07', '2026-08-25 14:37:23'),
(4, 'BK-00004', 'CON-00004', 'daily', 3, 3, 0, 1, 1, 2, 2, 'Dubai Airport - Terminal 2', 'Dubai Airport - Terminal 2', 6, NULL, NULL, 'Daily Standard', 'Daily', 3, NULL, '450.00', '100.00', '0.00', '0.00', '17.50', '367.50', '2026-08-25 00:00:00', '2026-08-28 00:00:00', 'limited', 750, '2.00', NULL, '150.00', '3500.00', NULL, '0.00', '1000.00', 1, 1, 'TNX-754325678', 1, 'completed', NULL, '2026-08-25 15:47:25', '2026-08-25 15:53:19'),
(5, 'BK-00005', 'CON-00005', 'daily', 23, 7, 0, 1, 3, 5, 5, '23lkjhvlj', '23lkjhvlj', 6, NULL, NULL, 'Daily Standard', 'Daily', 4, NULL, '4800.00', '30.00', '200.00', '0.00', '248.50', '5218.50', '2026-08-25 00:00:00', '2026-08-29 00:00:00', 'unlimited', 1000, '2.00', NULL, '1200.00', NULL, NULL, '0.00', '1000.00', 1, 1, 'TXN-9876543', 1, 'active', NULL, '2026-08-25 16:02:10', '2026-08-25 19:16:38'),
(6, 'BK-00006', 'CON-00006', 'daily', 22, 5, 0, 1, 3, 2, 2, 'Dubai Airport - Terminal 2', 'Dubai Airport - Terminal 2', 6, NULL, NULL, 'Daily Standard', 'Daily', 4, NULL, '2000.16', '190.00', '0.00', '0.00', '90.51', '1900.67', '2026-08-25 00:00:00', '2026-08-29 00:00:00', 'limited', 1000, '2.00', NULL, '500.04', NULL, NULL, '0.00', '1000.00', 2, 1, 'TXN-123450987', 1, 'active', NULL, '2026-08-25 19:23:30', '2026-08-26 20:32:47'),
(7, 'BK-00007', 'CON-00007', 'daily', 32, 3, 0, 1, 3, 2, 2, 'Dubai Airport - Terminal 2', 'Dubai Airport - Terminal 2', 6, 1, NULL, 'Daily Standard', 'Daily', 3, NULL, '450.00', '100.00', '0.00', '100.00', '22.50', '472.50', '2026-08-26 00:00:00', '2026-08-29 00:00:00', 'limited', 750, '2.00', NULL, '150.00', '3500.00', NULL, '0.00', '1000.00', 1, 1, 'TXN-876543', 1, 'active', NULL, '2026-08-26 20:47:17', '2026-08-26 20:49:23');

-- --------------------------------------------------------

--
-- Table structure for table `rental_types`
--

CREATE TABLE `rental_types` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `min_days` int NOT NULL DEFAULT '1',
  `max_days` int NOT NULL DEFAULT '1',
  `description` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `rental_types`
--

INSERT INTO `rental_types` (`id`, `name`, `min_days`, `max_days`, `description`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Daily', 1, 6, 'Per-day rental', 'active', '2026-08-22 01:46:50', '2026-08-22 01:46:50', NULL, NULL),
(2, 'Weekly', 7, 29, 'Per-week rental', 'active', '2026-08-22 01:46:50', '2026-08-22 01:46:50', NULL, NULL),
(3, 'Monthly', 30, 365, 'Per-month rental', 'active', '2026-08-22 01:46:50', '2026-08-22 01:46:50', NULL, NULL),
(4, 'Yearly', 1, 5, 'hange appears in the forms instantly', 'active', '2026-08-22 01:52:47', '2026-08-22 01:52:47', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `sources`
--

CREATE TABLE `sources` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sources`
--

INSERT INTO `sources` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(2, 'Website', 'active', '2026-08-16 22:41:41', '2026-08-16 22:41:41', NULL, NULL),
(4, 'Referral', 'active', '2026-08-16 22:41:41', '2026-08-16 22:41:41', NULL, NULL),
(5, 'Phone', 'active', '2026-08-16 22:41:41', '2026-08-16 22:41:41', NULL, NULL),
(6, 'Walk-in', 'active', '2026-08-17 16:12:19', '2026-08-17 16:12:42', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tariffs`
--

CREATE TABLE `tariffs` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tariffs`
--

INSERT INTO `tariffs` (`id`, `name`, `description`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Standard', 'Default company tariff', 'active', '2026-08-22 02:13:18', '2026-08-22 02:48:58', NULL, 1),
(2, 'saad', 'dddddddddddddddddddd', 'active', '2026-08-22 02:35:23', '2026-08-22 02:35:23', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tariff_details`
--

CREATE TABLE `tariff_details` (
  `id` int UNSIGNED NOT NULL,
  `tariff_id` int UNSIGNED NOT NULL,
  `group_id` int UNSIGNED NOT NULL,
  `branch_id` int UNSIGNED DEFAULT NULL,
  `pricing_mode_id` int UNSIGNED NOT NULL,
  `rental_type_id` int UNSIGNED NOT NULL,
  `rack_rate` decimal(10,2) NOT NULL,
  `floor_rate` decimal(10,2) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tariff_details`
--

INSERT INTO `tariff_details` (`id`, `tariff_id`, `group_id`, `branch_id`, `pricing_mode_id`, `rental_type_id`, `rack_rate`, `floor_rate`, `is_default`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 2, 4, 3, 2, 1, '2.00', '1.50', 1, 'active', '2026-08-22 02:35:51', '2026-08-22 02:35:51', 1, 1),
(2, 1, 1, 6, 6, 1, '200.00', '200.00', 1, 'active', '2026-08-22 13:33:05', '2026-08-22 13:33:05', 1, 1),
(3, 1, 1, NULL, 1, 1, '250.00', '200.00', 1, 'active', '2026-08-22 13:51:36', '2026-08-22 13:51:36', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `technical_statuses`
--

CREATE TABLE `technical_statuses` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(30) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `technical_statuses`
--

INSERT INTO `technical_statuses` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(5, 'Fully Operational', 'active', '2026-08-18 11:16:35', '2026-08-18 11:16:35', 1, 1),
(6, 'Partially Functional', 'active', '2026-08-18 11:17:00', '2026-08-18 11:17:00', 1, 1),
(7, 'Operational With Restrictions', 'active', '2026-08-18 11:17:07', '2026-08-18 11:17:07', 1, 1),
(8, 'Maintenance Required', 'active', '2026-08-18 11:17:15', '2026-08-18 11:17:15', 1, 1),
(9, 'Inspection Due', 'active', '2026-08-18 11:17:38', '2026-08-18 11:17:38', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `transmissions`
--

CREATE TABLE `transmissions` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(20) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transmissions`
--

INSERT INTO `transmissions` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Automatic', 'active', '2026-08-15 22:30:50', '2026-08-15 22:30:50', NULL, NULL),
(2, 'Manual', 'active', '2026-08-15 22:30:50', '2026-08-15 22:30:50', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('admin','staff','inspector') NOT NULL DEFAULT 'staff',
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `full_name`, `email`, `role`, `avatar_url`, `created_at`, `updated_at`) VALUES
(1, 'root', '$2y$10$zeqz/WiI4Tljo3q5S0V64u/XRIXP2A9PQwLDebB.l0sRL1S/Mzee6', 'System Admin', NULL, 'admin', 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff', '2026-08-12 01:00:32', '2026-08-14 21:44:19'),
(2, 'staff1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ahmed Mohamed', NULL, 'staff', 'https://ui-avatars.com/api/?name=Ahmed+Mohamed&background=10B981&color=fff', '2026-08-12 01:00:32', '2026-08-12 01:00:32'),
(3, 'inspector', '$2y$10$zeqz/WiI4Tljo3q5S0V64u/XRIXP2A9PQwLDebB.l0sRL1S/Mzee6', 'Inspection Officer', 'inspector@carrental.local', 'inspector', NULL, '2026-08-24 13:21:32', '2026-08-24 13:21:32');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_makes`
--

CREATE TABLE `vehicle_makes` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vehicle_makes`
--

INSERT INTO `vehicle_makes` (`id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Toyota', 'active', '2026-08-17 22:30:58', '2026-08-17 22:30:58', NULL, NULL),
(2, 'Nissan', 'active', '2026-08-17 22:30:58', '2026-08-17 22:30:58', NULL, NULL),
(3, 'BMW', 'active', '2026-08-17 22:30:58', '2026-08-17 22:30:58', NULL, NULL),
(4, 'Honda', 'active', '2026-08-17 22:30:58', '2026-08-17 22:30:58', NULL, NULL),
(5, 'MG', 'active', '2026-08-17 22:30:58', '2026-08-17 22:30:58', NULL, NULL),
(6, 'Mercedes-Benz', 'active', '2026-08-17 22:49:24', '2026-08-18 10:36:41', 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_models`
--

CREATE TABLE `vehicle_models` (
  `id` int UNSIGNED NOT NULL,
  `make_id` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `vehicle_models`
--

INSERT INTO `vehicle_models` (`id`, `make_id`, `name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 6, 'Benz', 'active', '2026-08-17 22:50:01', '2026-08-17 22:50:01', 1, 1),
(2, 3, 'X5', 'active', '2026-08-17 23:03:12', '2026-08-17 23:03:12', NULL, NULL),
(3, 4, 'Civic', 'active', '2026-08-17 23:03:12', '2026-08-17 23:03:12', NULL, NULL),
(4, 5, 'MG5', 'active', '2026-08-17 23:03:12', '2026-08-17 23:03:12', NULL, NULL),
(5, 2, 'Patrol', 'active', '2026-08-17 23:03:12', '2026-08-17 23:03:12', NULL, NULL),
(6, 1, 'Camry', 'active', '2026-08-17 23:03:12', '2026-08-17 23:03:12', NULL, NULL),
(9, 6, 'C-Class C200', 'active', '2026-08-18 10:37:09', '2026-08-18 10:37:09', 1, 1),
(10, 6, 'ffffffffffffff', 'active', '2026-08-18 15:59:19', '2026-08-18 15:59:19', 1, 1),
(11, 5, 'ZX', 'active', '2026-08-22 14:25:58', '2026-08-22 14:25:58', 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_token` (`token_hash`),
  ADD KEY `fk_tokens_user` (`user_id`);

--
-- Indexes for table `body_types`
--
ALTER TABLE `body_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `borders`
--
ALTER TABLE `borders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `border_fees`
--
ALTER TABLE `border_fees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_border_group` (`border_id`,`group_id`),
  ADD KEY `fk_bf_group` (`group_id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `plate_number` (`plate_number`),
  ADD UNIQUE KEY `uniq_vin` (`vin`),
  ADD KEY `fk_car_color` (`color_id`),
  ADD KEY `fk_car_tech` (`technical_status_id`);

--
-- Indexes for table `car_groups`
--
ALTER TABLE `car_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `car_models`
--
ALTER TABLE `car_models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_model_body` (`body_type_id`),
  ADD KEY `fk_model_fuel` (`fuel_type_id`),
  ADD KEY `fk_model_trans` (`transmission_id`),
  ADD KEY `fk_model_group` (`group_id`),
  ADD KEY `fk_cm_engine` (`engine_capacity_id`);

--
-- Indexes for table `colors`
--
ALTER TABLE `colors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `license_number` (`license_number`),
  ADD UNIQUE KEY `national_id` (`national_id`),
  ADD KEY `fk_customer_license` (`license_type_id`);

--
-- Indexes for table `customer_types`
--
ALTER TABLE `customer_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `engine_capacities`
--
ALTER TABLE `engine_capacities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `fuel_types`
--
ALTER TABLE `fuel_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `inspections`
--
ALTER TABLE `inspections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rental_id` (`rental_id`),
  ADD KEY `inspector_id` (`inspector_id`);

--
-- Indexes for table `km_policies`
--
ALTER TABLE `km_policies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_km` (`rental_type_id`,`group_id`),
  ADD KEY `fk_km_group` (`group_id`);

--
-- Indexes for table `license_types`
--
ALTER TABLE `license_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `pricing_modes`
--
ALTER TABLE `pricing_modes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_booking` (`booking_number`),
  ADD UNIQUE KEY `uniq_contract` (`contract_number`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `car_id` (`car_id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `fk_rental_pickup` (`pickup_branch_id`),
  ADD KEY `fk_rental_return` (`return_branch_id`),
  ADD KEY `fk_rental_source` (`hirer_source_id`),
  ADD KEY `fk_rental_border` (`cross_border_id`),
  ADD KEY `fk_rental_dep_method` (`security_deposit_method_id`),
  ADD KEY `fk_rental_currency` (`currency_id`);

--
-- Indexes for table `rental_types`
--
ALTER TABLE `rental_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `sources`
--
ALTER TABLE `sources`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `tariffs`
--
ALTER TABLE `tariffs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `tariff_details`
--
ALTER TABLE `tariff_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_line` (`tariff_id`,`group_id`,`branch_id`,`pricing_mode_id`,`rental_type_id`),
  ADD KEY `fk_td_group` (`group_id`),
  ADD KEY `fk_td_branch` (`branch_id`),
  ADD KEY `fk_td_mode` (`pricing_mode_id`),
  ADD KEY `fk_td_rtype` (`rental_type_id`);

--
-- Indexes for table `technical_statuses`
--
ALTER TABLE `technical_statuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `transmissions`
--
ALTER TABLE `transmissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vehicle_makes`
--
ALTER TABLE `vehicle_makes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_name` (`name`);

--
-- Indexes for table `vehicle_models`
--
ALTER TABLE `vehicle_models`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_make_model` (`make_id`,`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `api_tokens`
--
ALTER TABLE `api_tokens`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `body_types`
--
ALTER TABLE `body_types`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `borders`
--
ALTER TABLE `borders`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `border_fees`
--
ALTER TABLE `border_fees`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `cars`
--
ALTER TABLE `cars`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `car_groups`
--
ALTER TABLE `car_groups`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `car_models`
--
ALTER TABLE `car_models`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `colors`
--
ALTER TABLE `colors`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `customer_types`
--
ALTER TABLE `customer_types`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `engine_capacities`
--
ALTER TABLE `engine_capacities`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `fuel_types`
--
ALTER TABLE `fuel_types`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `inspections`
--
ALTER TABLE `inspections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `km_policies`
--
ALTER TABLE `km_policies`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `license_types`
--
ALTER TABLE `license_types`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `pricing_modes`
--
ALTER TABLE `pricing_modes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `rentals`
--
ALTER TABLE `rentals`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `rental_types`
--
ALTER TABLE `rental_types`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `sources`
--
ALTER TABLE `sources`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tariffs`
--
ALTER TABLE `tariffs`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tariff_details`
--
ALTER TABLE `tariff_details`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `technical_statuses`
--
ALTER TABLE `technical_statuses`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `transmissions`
--
ALTER TABLE `transmissions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `vehicle_makes`
--
ALTER TABLE `vehicle_makes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `vehicle_models`
--
ALTER TABLE `vehicle_models`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `api_tokens`
--
ALTER TABLE `api_tokens`
  ADD CONSTRAINT `fk_tokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `border_fees`
--
ALTER TABLE `border_fees`
  ADD CONSTRAINT `fk_bf_border` FOREIGN KEY (`border_id`) REFERENCES `borders` (`id`),
  ADD CONSTRAINT `fk_bf_group` FOREIGN KEY (`group_id`) REFERENCES `car_groups` (`id`);

--
-- Constraints for table `cars`
--
ALTER TABLE `cars`
  ADD CONSTRAINT `fk_car_color` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`),
  ADD CONSTRAINT `fk_car_tech` FOREIGN KEY (`technical_status_id`) REFERENCES `technical_statuses` (`id`);

--
-- Constraints for table `car_models`
--
ALTER TABLE `car_models`
  ADD CONSTRAINT `fk_cm_engine` FOREIGN KEY (`engine_capacity_id`) REFERENCES `engine_capacities` (`id`),
  ADD CONSTRAINT `fk_model_body` FOREIGN KEY (`body_type_id`) REFERENCES `body_types` (`id`),
  ADD CONSTRAINT `fk_model_fuel` FOREIGN KEY (`fuel_type_id`) REFERENCES `fuel_types` (`id`),
  ADD CONSTRAINT `fk_model_group` FOREIGN KEY (`group_id`) REFERENCES `car_groups` (`id`),
  ADD CONSTRAINT `fk_model_trans` FOREIGN KEY (`transmission_id`) REFERENCES `transmissions` (`id`);

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `fk_customer_license` FOREIGN KEY (`license_type_id`) REFERENCES `license_types` (`id`);

--
-- Constraints for table `inspections`
--
ALTER TABLE `inspections`
  ADD CONSTRAINT `inspections_ibfk_1` FOREIGN KEY (`rental_id`) REFERENCES `rentals` (`id`),
  ADD CONSTRAINT `inspections_ibfk_2` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `km_policies`
--
ALTER TABLE `km_policies`
  ADD CONSTRAINT `fk_km_group` FOREIGN KEY (`group_id`) REFERENCES `car_groups` (`id`),
  ADD CONSTRAINT `fk_km_rtype` FOREIGN KEY (`rental_type_id`) REFERENCES `rental_types` (`id`);

--
-- Constraints for table `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `fk_rental_border` FOREIGN KEY (`cross_border_id`) REFERENCES `borders` (`id`),
  ADD CONSTRAINT `fk_rental_currency` FOREIGN KEY (`currency_id`) REFERENCES `currencies` (`id`),
  ADD CONSTRAINT `fk_rental_dep_method` FOREIGN KEY (`security_deposit_method_id`) REFERENCES `payment_methods` (`id`),
  ADD CONSTRAINT `fk_rental_pickup` FOREIGN KEY (`pickup_branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `fk_rental_return` FOREIGN KEY (`return_branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `fk_rental_source` FOREIGN KEY (`hirer_source_id`) REFERENCES `sources` (`id`),
  ADD CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `rentals_ibfk_2` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`),
  ADD CONSTRAINT `rentals_ibfk_3` FOREIGN KEY (`staff_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `tariff_details`
--
ALTER TABLE `tariff_details`
  ADD CONSTRAINT `fk_td_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `fk_td_group` FOREIGN KEY (`group_id`) REFERENCES `car_groups` (`id`),
  ADD CONSTRAINT `fk_td_mode` FOREIGN KEY (`pricing_mode_id`) REFERENCES `pricing_modes` (`id`),
  ADD CONSTRAINT `fk_td_rtype` FOREIGN KEY (`rental_type_id`) REFERENCES `rental_types` (`id`),
  ADD CONSTRAINT `fk_td_tariff` FOREIGN KEY (`tariff_id`) REFERENCES `tariffs` (`id`);

--
-- Constraints for table `vehicle_models`
--
ALTER TABLE `vehicle_models`
  ADD CONSTRAINT `fk_vm_make` FOREIGN KEY (`make_id`) REFERENCES `vehicle_makes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
