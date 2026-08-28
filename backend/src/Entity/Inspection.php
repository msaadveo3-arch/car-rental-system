<?php

namespace App\Entity;

use App\Repository\InspectionRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InspectionRepository::class)]
#[ORM\Table(name: 'inspections')]
class Inspection
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Rental::class)]
    #[ORM\JoinColumn(name: 'rental_id', referencedColumnName: 'id', nullable: false)]
    private Rental $rental;

    #[ORM\Column(name: 'inspection_type', type: Types::STRING)]
    private string $inspectionType;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'inspector_id', referencedColumnName: 'id', nullable: false)]
    private User $inspector;

    #[ORM\Column(name: 'inspection_date', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $inspectionDate = null;

    #[ORM\Column(name: 'damage_report', type: Types::JSON, nullable: true)]
    private ?array $damageReport = null;

    #[ORM\Column(name: 'photos', type: Types::JSON, nullable: true)]
    private ?array $photos = null;

    #[ORM\Column(name: 'notes', type: Types::TEXT, length: 65535, nullable: true)]
    private ?string $notes = null;

    #[ORM\Column(name: 'status', type: Types::STRING, nullable: true)]
    private ?string $status = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    public function getId(): ?int { return $this->id; }

    public function getRental(): Rental { return $this->rental; }
    public function setRental(Rental $rental): self { $this->rental = $rental; return $this; }

    public function getInspectionType(): string { return $this->inspectionType; }
    public function setInspectionType(string $inspectionType): self { $this->inspectionType = $inspectionType; return $this; }

    public function getInspector(): User { return $this->inspector; }
    public function setInspector(User $inspector): self { $this->inspector = $inspector; return $this; }

    public function getInspectionDate(): ?\DateTimeInterface { return $this->inspectionDate; }
    public function setInspectionDate(?\DateTimeInterface $inspectionDate): self { $this->inspectionDate = $inspectionDate; return $this; }

    public function getDamageReport(): ?array { return $this->damageReport; }
    public function setDamageReport(?array $damageReport): self { $this->damageReport = $damageReport; return $this; }

    public function getPhotos(): ?array { return $this->photos; }
    public function setPhotos(?array $photos): self { $this->photos = $photos; return $this; }

    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): self { $this->notes = $notes; return $this; }

    public function getStatus(): ?string { return $this->status; }
    public function setStatus(?string $status): self { $this->status = $status; return $this; }

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(?\DateTimeInterface $createdAt): self { $this->createdAt = $createdAt; return $this; }

    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }
    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self { $this->updatedAt = $updatedAt; return $this; }
}
