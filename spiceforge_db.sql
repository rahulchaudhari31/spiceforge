-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 11, 2026 at 09:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spiceforge_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_code` varchar(50) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_type` enum('individual','company','retailer','wholesaler') NOT NULL DEFAULT 'individual',
  `gst_number` varchar(50) DEFAULT NULL,
  `pan_number` varchar(50) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `tally_ledger_code` varchar(50) DEFAULT NULL,
  `tally_ledger_name` varchar(255) DEFAULT NULL,
  `tally_sync_status` enum('pending','synced','error') NOT NULL DEFAULT 'pending',
  `tally_last_synced_at` timestamp NULL DEFAULT NULL,
  `xml_export_status` enum('pending','exported','error') NOT NULL DEFAULT 'pending',
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_code`, `customer_name`, `customer_type`, `gst_number`, `pan_number`, `email`, `phone`, `contact_person`, `address`, `tally_ledger_code`, `tally_ledger_name`, `tally_sync_status`, `tally_last_synced_at`, `xml_export_status`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'CU001', 'TEST', 'individual', '12345', '12345', 'TEST@gmail.com', '0192837465', 'TEST', 'TEST', NULL, NULL, 'pending', NULL, 'pending', 'active', 2, 2, '2026-08-10 07:36:12', '2026-08-10 07:36:12'),
(2, 'CU002', 'TEST', 'individual', '12345', '12345', 'TEST2@GMAIL.COM', '12345', 'TEST', 'TEST', NULL, NULL, 'pending', NULL, 'pending', 'active', 2, 2, '2026-08-11 00:43:04', '2026-08-11 00:43:04');

-- --------------------------------------------------------

--
-- Table structure for table `delivery_requirements`
--

CREATE TABLE `delivery_requirements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `delivery_type` enum('express','standard','scheduled') NOT NULL DEFAULT 'standard',
  `time_slot` varchar(255) DEFAULT NULL,
  `special_instructions` text DEFAULT NULL,
  `preferred_carrier` varchar(255) DEFAULT NULL,
  `delivery_zone` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dispatch_locations`
--

CREATE TABLE `dispatch_locations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `customer_id` bigint(20) UNSIGNED NOT NULL,
  `location_code` varchar(50) NOT NULL,
  `location_name` varchar(255) NOT NULL,
  `address` text DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facilities`
--

CREATE TABLE `facilities` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `facility_code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('production','packaging','warehouse','cold_storage','third_party') NOT NULL,
  `address` text DEFAULT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(255) DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `linked_warehouses` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`linked_warehouses`)),
  `production_lines` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`production_lines`)),
  `tally_godown_code` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `facilities`
--

INSERT INTO `facilities` (`id`, `facility_code`, `name`, `type`, `address`, `contact_person`, `contact_phone`, `contact_email`, `linked_warehouses`, `production_lines`, `tally_godown_code`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, '001', 'TEST', 'warehouse', 'TEST', 'TEST', '102984756', 'TEST@gmail.com', '[]', '[]', 'qwerty12345', 'active', 2, 2, '2026-08-10 07:37:11', '2026-08-10 07:37:11');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inspection_audit_logs`
--

CREATE TABLE `inspection_audit_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `inspection_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(255) NOT NULL,
  `performed_by` bigint(20) UNSIGNED NOT NULL,
  `old_status` varchar(255) DEFAULT NULL,
  `new_status` varchar(255) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inspection_items`
--

CREATE TABLE `inspection_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `inspection_id` bigint(20) UNSIGNED NOT NULL,
  `material_name` varchar(255) NOT NULL,
  `lot_number` varchar(255) DEFAULT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT 0.00,
  `unit` varchar(255) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inspection_items`
--

INSERT INTO `inspection_items` (`id`, `inspection_id`, `material_name`, `lot_number`, `quantity`, `unit`, `remark`, `created_at`, `updated_at`) VALUES
(1, 1, 'TEST', '100', 100.00, '100', '100', '2026-08-09 07:44:50', '2026-08-09 07:44:50'),
(2, 2, 'TEST', '100', 100.00, '100', 'TEST', '2026-08-10 07:39:04', '2026-08-10 07:39:04');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_08_02_000000_create_personal_access_tokens_table', 1),
(5, '2026_08_03_083108_create_facilities_table', 1),
(6, '2026_08_06_074258_2026_08_01_000000_create_customers_table', 1),
(7, '2026_08_06_074302_2026_08_02_000000_create_dispatch_locations_table', 1),
(8, '2026_08_06_074306_2026_08_03_000000_create_delivery_requirements_table', 1),
(9, '2026_08_09_090148_create_vehicle_inspections_tables', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 2, 'auth_token', 'ee0bcf1d5daa88d2fa0af32918bc2f162c4cc528db26f448f9f908dae965c250', '[\"*\"]', '2026-08-09 07:46:34', NULL, '2026-08-09 07:34:27', '2026-08-09 07:46:34'),
(2, 'App\\Models\\User', 2, 'auth_token', '5f6562cfe6bca6b0c34c18b87c5e231bad026875986021dcd49f1c4b62cf1008', '[\"*\"]', '2026-08-10 07:39:49', NULL, '2026-08-10 07:35:21', '2026-08-10 07:39:49'),
(3, 'App\\Models\\User', 2, 'auth_token', '862514b5181f1f79bca6e902d7f360dbc4fbca08af384b44899487e37d3f80fd', '[\"*\"]', '2026-08-10 11:05:18', NULL, '2026-08-10 10:55:54', '2026-08-10 11:05:18'),
(4, 'App\\Models\\User', 2, 'auth_token', '20905189bf89d1f9659b3cf29439f8a37b95519d40e440545117c881b9657200', '[\"*\"]', '2026-08-11 01:37:00', NULL, '2026-08-11 00:41:52', '2026-08-11 01:37:00'),
(5, 'App\\Models\\User', 2, 'auth_token', '87acbca1ed7703b8dda2064b45051dd6b1328030da6a9cc6c8d126e80d9f951a', '[\"*\"]', '2026-08-11 02:09:54', NULL, '2026-08-11 01:42:38', '2026-08-11 02:09:54');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@spiceforge.com', NULL, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NULL, '2026-08-09 12:59:39', '2026-08-09 12:59:39'),
(2, 'Super Admin', 'superadmin@spiceforge.com', '2026-08-09 13:01:47', '$2y$12$BprWHnCeMSmrdcQ4ES6ZN.R8vKPiNmNzoXNuGjyeLH3p2UCFyiu0G', NULL, '2026-08-09 13:01:47', '2026-08-09 13:01:47');

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_inspections`
--

CREATE TABLE `vehicle_inspections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `inspection_type` enum('loading','unloading') NOT NULL,
  `location` varchar(255) NOT NULL,
  `vehicle_no` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `vehicle_condition` enum('clean','unclean','na') NOT NULL DEFAULT 'na',
  `insects` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `undesirable_odour` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `nail_bolt_projection` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `covered_from_top` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `camera_check` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `proper_holding_rope` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `floorboard_ok` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `waste_spoilage` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `oil_grease_chemicals` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `garbage` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `insect_rodent_activity` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `bad_odour` enum('yes','no','na') NOT NULL DEFAULT 'na',
  `observation` text DEFAULT NULL,
  `remarks` text DEFAULT NULL,
  `status` enum('draft','submitted','under_review','approved','rejected','revised') NOT NULL DEFAULT 'draft',
  `checked_by` bigint(20) UNSIGNED DEFAULT NULL,
  `verified_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `approved_by` bigint(20) UNSIGNED DEFAULT NULL,
  `reviewed_at` timestamp NULL DEFAULT NULL,
  `approved_at` timestamp NULL DEFAULT NULL,
  `is_locked` tinyint(1) NOT NULL DEFAULT 0,
  `locked_at` timestamp NULL DEFAULT NULL,
  `locked_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicle_inspections`
--

INSERT INTO `vehicle_inspections` (`id`, `inspection_type`, `location`, `vehicle_no`, `date`, `time`, `vehicle_condition`, `insects`, `undesirable_odour`, `nail_bolt_projection`, `covered_from_top`, `camera_check`, `proper_holding_rope`, `floorboard_ok`, `waste_spoilage`, `oil_grease_chemicals`, `garbage`, `insect_rodent_activity`, `bad_odour`, `observation`, `remarks`, `status`, `checked_by`, `verified_by`, `reviewed_by`, `approved_by`, `reviewed_at`, `approved_at`, `is_locked`, `locked_at`, `locked_by`, `created_at`, `updated_at`) VALUES
(1, 'loading', 'TEST', 'QW12QW1234', '2026-08-09', '18:40:00', 'clean', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'TEST', 'TEST', 'submitted', 2, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '2026-08-09 07:44:50', '2026-08-09 07:44:50'),
(2, 'loading', 'TEST', 'qw12qw1234', '2026-08-10', '18:37:00', 'clean', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'yes', 'TEST', 'TEST', 'submitted', 2, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, '2026-08-10 07:39:04', '2026-08-10 07:39:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customers_customer_code_unique` (`customer_code`),
  ADD UNIQUE KEY `customers_email_unique` (`email`),
  ADD KEY `customers_created_by_foreign` (`created_by`),
  ADD KEY `customers_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `delivery_requirements`
--
ALTER TABLE `delivery_requirements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `delivery_requirements_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `dispatch_locations`
--
ALTER TABLE `dispatch_locations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dispatch_locations_location_code_unique` (`location_code`),
  ADD KEY `dispatch_locations_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `facilities`
--
ALTER TABLE `facilities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `facilities_facility_code_unique` (`facility_code`),
  ADD KEY `facilities_created_by_foreign` (`created_by`),
  ADD KEY `facilities_updated_by_foreign` (`updated_by`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `inspection_audit_logs`
--
ALTER TABLE `inspection_audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inspection_audit_logs_inspection_id_foreign` (`inspection_id`),
  ADD KEY `inspection_audit_logs_performed_by_foreign` (`performed_by`);

--
-- Indexes for table `inspection_items`
--
ALTER TABLE `inspection_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inspection_items_inspection_id_foreign` (`inspection_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `vehicle_inspections`
--
ALTER TABLE `vehicle_inspections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_inspections_checked_by_foreign` (`checked_by`),
  ADD KEY `vehicle_inspections_verified_by_foreign` (`verified_by`),
  ADD KEY `vehicle_inspections_reviewed_by_foreign` (`reviewed_by`),
  ADD KEY `vehicle_inspections_approved_by_foreign` (`approved_by`),
  ADD KEY `vehicle_inspections_locked_by_foreign` (`locked_by`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `delivery_requirements`
--
ALTER TABLE `delivery_requirements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dispatch_locations`
--
ALTER TABLE `dispatch_locations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facilities`
--
ALTER TABLE `facilities`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inspection_audit_logs`
--
ALTER TABLE `inspection_audit_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inspection_items`
--
ALTER TABLE `inspection_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `vehicle_inspections`
--
ALTER TABLE `vehicle_inspections`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `customers_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `delivery_requirements`
--
ALTER TABLE `delivery_requirements`
  ADD CONSTRAINT `delivery_requirements_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `dispatch_locations`
--
ALTER TABLE `dispatch_locations`
  ADD CONSTRAINT `dispatch_locations_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `facilities`
--
ALTER TABLE `facilities`
  ADD CONSTRAINT `facilities_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `facilities_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `inspection_audit_logs`
--
ALTER TABLE `inspection_audit_logs`
  ADD CONSTRAINT `inspection_audit_logs_inspection_id_foreign` FOREIGN KEY (`inspection_id`) REFERENCES `vehicle_inspections` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inspection_audit_logs_performed_by_foreign` FOREIGN KEY (`performed_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `inspection_items`
--
ALTER TABLE `inspection_items`
  ADD CONSTRAINT `inspection_items_inspection_id_foreign` FOREIGN KEY (`inspection_id`) REFERENCES `vehicle_inspections` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vehicle_inspections`
--
ALTER TABLE `vehicle_inspections`
  ADD CONSTRAINT `vehicle_inspections_approved_by_foreign` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `vehicle_inspections_checked_by_foreign` FOREIGN KEY (`checked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `vehicle_inspections_locked_by_foreign` FOREIGN KEY (`locked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `vehicle_inspections_reviewed_by_foreign` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `vehicle_inspections_verified_by_foreign` FOREIGN KEY (`verified_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
