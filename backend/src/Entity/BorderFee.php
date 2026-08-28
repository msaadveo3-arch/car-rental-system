<?php

namespace App\Entity;

use App\Repository\BorderFeeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BorderFeeRepository::class)]
#[ORM\Table(name: 'border_fees')]
class BorderFee
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Border::class)]
    #[ORM\JoinColumn(name: 'border_id', referencedColumnName: 'id', nullable: false)]
    private Border $border;

    #[ORM\ManyToOne(targetEntity: CarGroup::class)]
    #[ORM\JoinColumn(name: 'group_id', referencedColumnName: 'id', nullable: false)]
    private CarGroup $group;

    #[ORM\Column(name: 'fee', type: Types::DECIMAL, precision: 10, scale: 2)]
    private string $fee;

    #[ORM\Column(name: 'created_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(name: 'created_by', type: Types::INTEGER, nullable: true)]
    private ?int $createdBy = null;

    #[ORM\Column(name: 'updated_by', type: Types::INTEGER, nullable: true)]
    private ?int $updatedBy = null;

    public function getId(): ?int { return $this->id; }

    public function getBorder(): Border { return $this->border; }
    public function setBorder(Border $border): self { $this->border = $border; return $this; }

    public function getGroup(): CarGroup { return $this->group; }
    public function setGroup(CarGroup $group): self { $this->group = $group; return $this; }

    public function getFee(): string { return $this->fee; }
    public function setFee(string $fee): self { $this->fee = $fee; return $this; }

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(?\DateTimeInterface $createdAt): self { $this->createdAt = $createdAt; return $this; }

    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }
    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self { $this->updatedAt = $updatedAt; return $this; }

    public function getCreatedBy(): ?int { return $this->createdBy; }
    public function setCreatedBy(?int $createdBy): self { $this->createdBy = $createdBy; return $this; }

    public function getUpdatedBy(): ?int { return $this->updatedBy; }
    public function setUpdatedBy(?int $updatedBy): self { $this->updatedBy = $updatedBy; return $this; }
}
