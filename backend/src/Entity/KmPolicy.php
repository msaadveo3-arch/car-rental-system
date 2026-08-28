<?php

namespace App\Entity;

use App\Repository\KmPolicyRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: KmPolicyRepository::class)]
#[ORM\Table(name: 'km_policies')]
class KmPolicy
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: RentalType::class)]
    #[ORM\JoinColumn(name: 'rental_type_id', referencedColumnName: 'id', nullable: false)]
    private RentalType $rentalType;

    #[ORM\ManyToOne(targetEntity: CarGroup::class)]
    #[ORM\JoinColumn(name: 'group_id', referencedColumnName: 'id', nullable: false)]
    private CarGroup $group;

    #[ORM\Column(name: 'max_km', type: Types::INTEGER)]
    private int $maxKm;

    #[ORM\Column(name: 'extra_km_rate', type: Types::DECIMAL, precision: 10, scale: 2)]
    private string $extraKmRate;

    #[ORM\Column(name: 'unlimited_daily_amount', type: Types::DECIMAL, precision: 10, scale: 2)]
    private string $unlimitedDailyAmount;

    #[ORM\Column(name: 'status', type: Types::STRING, length: 20)]
    private string $status;

    #[ORM\Column(name: 'created_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(name: 'created_by', type: Types::INTEGER, nullable: true)]
    private ?int $createdBy = null;

    #[ORM\Column(name: 'updated_by', type: Types::INTEGER, nullable: true)]
    private ?int $updatedBy = null;

    public function getId(): ?int { return $this->id; }

    public function getRentalType(): RentalType { return $this->rentalType; }
    public function setRentalType(RentalType $rentalType): self { $this->rentalType = $rentalType; return $this; }

    public function getGroup(): CarGroup { return $this->group; }
    public function setGroup(CarGroup $group): self { $this->group = $group; return $this; }

    public function getMaxKm(): int { return $this->maxKm; }
    public function setMaxKm(int $maxKm): self { $this->maxKm = $maxKm; return $this; }

    public function getExtraKmRate(): string { return $this->extraKmRate; }
    public function setExtraKmRate(string $extraKmRate): self { $this->extraKmRate = $extraKmRate; return $this; }

    public function getUnlimitedDailyAmount(): string { return $this->unlimitedDailyAmount; }
    public function setUnlimitedDailyAmount(string $unlimitedDailyAmount): self { $this->unlimitedDailyAmount = $unlimitedDailyAmount; return $this; }

    public function getStatus(): string { return $this->status; }
    public function setStatus(string $status): self { $this->status = $status; return $this; }

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(?\DateTimeInterface $createdAt): self { $this->createdAt = $createdAt; return $this; }

    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }
    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self { $this->updatedAt = $updatedAt; return $this; }

    public function getCreatedBy(): ?int { return $this->createdBy; }
    public function setCreatedBy(?int $createdBy): self { $this->createdBy = $createdBy; return $this; }

    public function getUpdatedBy(): ?int { return $this->updatedBy; }
    public function setUpdatedBy(?int $updatedBy): self { $this->updatedBy = $updatedBy; return $this; }
}
