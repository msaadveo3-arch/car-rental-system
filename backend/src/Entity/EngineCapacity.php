<?php

namespace App\Entity;

use App\Repository\EngineCapacityRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: EngineCapacityRepository::class)]
#[ORM\Table(name: 'engine_capacities')]
class EngineCapacity
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(name: 'name', type: Types::STRING, length: 30)]
    private string $name;

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

    public function getName(): string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }

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
