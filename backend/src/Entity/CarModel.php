<?php

namespace App\Entity;

use App\Repository\CarModelRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CarModelRepository::class)]
#[ORM\Table(name: 'car_models')]
class CarModel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(name: 'make_id', type: Types::INTEGER, nullable: true)]
    private ?int $makeId = null;

    #[ORM\Column(name: 'model_id', type: Types::INTEGER, nullable: true)]
    private ?int $modelId = null;

    #[ORM\ManyToOne(targetEntity: BodyType::class)]
    #[ORM\JoinColumn(name: 'body_type_id', referencedColumnName: 'id', nullable: true)]
    private ?BodyType $bodyType = null;

    #[ORM\Column(name: 'seats', type: Types::BOOLEAN, nullable: true)]
    private ?bool $seats = null;

    #[ORM\ManyToOne(targetEntity: FuelType::class)]
    #[ORM\JoinColumn(name: 'fuel_type_id', referencedColumnName: 'id', nullable: true)]
    private ?FuelType $fuelType = null;

    #[ORM\ManyToOne(targetEntity: EngineCapacity::class)]
    #[ORM\JoinColumn(name: 'engine_capacity_id', referencedColumnName: 'id', nullable: true)]
    private ?EngineCapacity $engineCapacity = null;

    #[ORM\Column(name: 'horsepower', type: Types::INTEGER, nullable: true)]
    private ?int $horsepower = null;

    #[ORM\ManyToOne(targetEntity: Transmission::class)]
    #[ORM\JoinColumn(name: 'transmission_id', referencedColumnName: 'id', nullable: true)]
    private ?Transmission $transmission = null;

    #[ORM\ManyToOne(targetEntity: CarGroup::class)]
    #[ORM\JoinColumn(name: 'group_id', referencedColumnName: 'id', nullable: true)]
    private ?CarGroup $group = null;

    #[ORM\Column(name: 'image_url', type: Types::STRING, length: 255, nullable: true)]
    private ?string $imageUrl = null;

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

    public function getMakeId(): ?int { return $this->makeId; }
    public function setMakeId(?int $makeId): self { $this->makeId = $makeId; return $this; }

    public function getModelId(): ?int { return $this->modelId; }
    public function setModelId(?int $modelId): self { $this->modelId = $modelId; return $this; }

    public function getBodyType(): ?BodyType { return $this->bodyType; }
    public function setBodyType(?BodyType $bodyType): self { $this->bodyType = $bodyType; return $this; }

    public function getSeats(): ?bool { return $this->seats; }
    public function setSeats(?bool $seats): self { $this->seats = $seats; return $this; }

    public function getFuelType(): ?FuelType { return $this->fuelType; }
    public function setFuelType(?FuelType $fuelType): self { $this->fuelType = $fuelType; return $this; }

    public function getEngineCapacity(): ?EngineCapacity { return $this->engineCapacity; }
    public function setEngineCapacity(?EngineCapacity $engineCapacity): self { $this->engineCapacity = $engineCapacity; return $this; }

    public function getHorsepower(): ?int { return $this->horsepower; }
    public function setHorsepower(?int $horsepower): self { $this->horsepower = $horsepower; return $this; }

    public function getTransmission(): ?Transmission { return $this->transmission; }
    public function setTransmission(?Transmission $transmission): self { $this->transmission = $transmission; return $this; }

    public function getGroup(): ?CarGroup { return $this->group; }
    public function setGroup(?CarGroup $group): self { $this->group = $group; return $this; }

    public function getImageUrl(): ?string { return $this->imageUrl; }
    public function setImageUrl(?string $imageUrl): self { $this->imageUrl = $imageUrl; return $this; }

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
