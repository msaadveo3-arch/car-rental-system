<?php

namespace App\Entity;

use App\Repository\TariffDetailRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TariffDetailRepository::class)]
#[ORM\Table(name: 'tariff_details')]
class TariffDetail
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Tariff::class)]
    #[ORM\JoinColumn(name: 'tariff_id', referencedColumnName: 'id', nullable: false)]
    private Tariff $tariff;

    #[ORM\ManyToOne(targetEntity: CarGroup::class)]
    #[ORM\JoinColumn(name: 'group_id', referencedColumnName: 'id', nullable: false)]
    private CarGroup $group;

    #[ORM\ManyToOne(targetEntity: Branch::class)]
    #[ORM\JoinColumn(name: 'branch_id', referencedColumnName: 'id', nullable: true)]
    private ?Branch $branch = null;

    #[ORM\ManyToOne(targetEntity: PricingMode::class)]
    #[ORM\JoinColumn(name: 'pricing_mode_id', referencedColumnName: 'id', nullable: false)]
    private PricingMode $pricingMode;

    #[ORM\ManyToOne(targetEntity: RentalType::class)]
    #[ORM\JoinColumn(name: 'rental_type_id', referencedColumnName: 'id', nullable: false)]
    private RentalType $rentalType;

    #[ORM\Column(name: 'rack_rate', type: Types::DECIMAL, precision: 10, scale: 2)]
    private string $rackRate;

    #[ORM\Column(name: 'floor_rate', type: Types::DECIMAL, precision: 10, scale: 2)]
    private string $floorRate;

    #[ORM\Column(name: 'is_default', type: Types::BOOLEAN)]
    private bool $isDefault;

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

    public function getTariff(): Tariff { return $this->tariff; }
    public function setTariff(Tariff $tariff): self { $this->tariff = $tariff; return $this; }

    public function getGroup(): CarGroup { return $this->group; }
    public function setGroup(CarGroup $group): self { $this->group = $group; return $this; }

    public function getBranch(): ?Branch { return $this->branch; }
    public function setBranch(?Branch $branch): self { $this->branch = $branch; return $this; }

    public function getPricingMode(): PricingMode { return $this->pricingMode; }
    public function setPricingMode(PricingMode $pricingMode): self { $this->pricingMode = $pricingMode; return $this; }

    public function getRentalType(): RentalType { return $this->rentalType; }
    public function setRentalType(RentalType $rentalType): self { $this->rentalType = $rentalType; return $this; }

    public function getRackRate(): string { return $this->rackRate; }
    public function setRackRate(string $rackRate): self { $this->rackRate = $rackRate; return $this; }

    public function getFloorRate(): string { return $this->floorRate; }
    public function setFloorRate(string $floorRate): self { $this->floorRate = $floorRate; return $this; }

    public function getIsDefault(): bool { return $this->isDefault; }
    public function setIsDefault(bool $isDefault): self { $this->isDefault = $isDefault; return $this; }

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
