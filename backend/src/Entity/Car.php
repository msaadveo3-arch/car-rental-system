<?php

namespace App\Entity;

use App\Repository\CarRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CarRepository::class)]
#[ORM\Table(name: 'cars')]
class Car
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(name: 'model_id', type: Types::INTEGER, nullable: true)]
    private ?int $modelId = null;

    #[ORM\Column(name: 'plate_number', type: Types::STRING, length: 20)]
    private string $plateNumber;

    #[ORM\Column(name: 'vin', type: Types::STRING, length: 30, nullable: true)]
    private ?string $vin = null;

    #[ORM\Column(name: 'registration_number', type: Types::STRING, length: 50, nullable: true)]
    private ?string $registrationNumber = null;

    #[ORM\Column(name: 'registration_expiry', type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $registrationExpiry = null;

    #[ORM\Column(name: 'year', type: Types::DATE_MUTABLE)]
    private \DateTimeInterface $year;

    #[ORM\Column(name: 'manufacture_year', type: Types::INTEGER, nullable: true)]
    private ?int $manufactureYear = null;

    #[ORM\ManyToOne(targetEntity: Color::class)]
    #[ORM\JoinColumn(name: 'color_id', referencedColumnName: 'id', nullable: true)]
    private ?Color $color = null;

    #[ORM\ManyToOne(targetEntity: TechnicalStatus::class)]
    #[ORM\JoinColumn(name: 'technical_status_id', referencedColumnName: 'id', nullable: true)]
    private ?TechnicalStatus $technicalStatus = null;

    #[ORM\Column(name: 'daily_rate', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $dailyRate = null;

    #[ORM\Column(name: 'monthly_rate', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $monthlyRate = null;

    #[ORM\Column(name: 'status', type: Types::STRING, nullable: true)]
    private ?string $status = null;

    #[ORM\Column(name: 'location', type: Types::STRING, length: 100, nullable: true)]
    private ?string $location = null;

    #[ORM\Column(name: 'mileage', type: Types::INTEGER, nullable: true)]
    private ?int $mileage = null;

    #[ORM\Column(name: 'fuel_level', type: Types::STRING, nullable: true)]
    private ?string $fuelLevel = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(name: 'deleted_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $deletedAt = null;

    public function getId(): ?int { return $this->id; }

    public function getModelId(): ?int { return $this->modelId; }
    public function setModelId(?int $modelId): self { $this->modelId = $modelId; return $this; }

    public function getPlateNumber(): string { return $this->plateNumber; }
    public function setPlateNumber(string $plateNumber): self { $this->plateNumber = $plateNumber; return $this; }

    public function getVin(): ?string { return $this->vin; }
    public function setVin(?string $vin): self { $this->vin = $vin; return $this; }

    public function getRegistrationNumber(): ?string { return $this->registrationNumber; }
    public function setRegistrationNumber(?string $registrationNumber): self { $this->registrationNumber = $registrationNumber; return $this; }

    public function getRegistrationExpiry(): ?\DateTimeInterface { return $this->registrationExpiry; }
    public function setRegistrationExpiry(?\DateTimeInterface $registrationExpiry): self { $this->registrationExpiry = $registrationExpiry; return $this; }

    public function getYear(): \DateTimeInterface { return $this->year; }
    public function setYear(\DateTimeInterface $year): self { $this->year = $year; return $this; }

    public function getManufactureYear(): ?int { return $this->manufactureYear; }
    public function setManufactureYear(?int $manufactureYear): self { $this->manufactureYear = $manufactureYear; return $this; }

    public function getColor(): ?Color { return $this->color; }
    public function setColor(?Color $color): self { $this->color = $color; return $this; }

    public function getTechnicalStatus(): ?TechnicalStatus { return $this->technicalStatus; }
    public function setTechnicalStatus(?TechnicalStatus $technicalStatus): self { $this->technicalStatus = $technicalStatus; return $this; }

    public function getDailyRate(): ?string { return $this->dailyRate; }
    public function setDailyRate(?string $dailyRate): self { $this->dailyRate = $dailyRate; return $this; }

    public function getMonthlyRate(): ?string { return $this->monthlyRate; }
    public function setMonthlyRate(?string $monthlyRate): self { $this->monthlyRate = $monthlyRate; return $this; }

    public function getStatus(): ?string { return $this->status; }
    public function setStatus(?string $status): self { $this->status = $status; return $this; }

    public function getLocation(): ?string { return $this->location; }
    public function setLocation(?string $location): self { $this->location = $location; return $this; }

    public function getMileage(): ?int { return $this->mileage; }
    public function setMileage(?int $mileage): self { $this->mileage = $mileage; return $this; }

    public function getFuelLevel(): ?string { return $this->fuelLevel; }
    public function setFuelLevel(?string $fuelLevel): self { $this->fuelLevel = $fuelLevel; return $this; }

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(?\DateTimeInterface $createdAt): self { $this->createdAt = $createdAt; return $this; }

    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }
    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self { $this->updatedAt = $updatedAt; return $this; }

    public function getDeletedAt(): ?\DateTimeInterface { return $this->deletedAt; }
    public function setDeletedAt(?\DateTimeInterface $deletedAt): self { $this->deletedAt = $deletedAt; return $this; }
}
