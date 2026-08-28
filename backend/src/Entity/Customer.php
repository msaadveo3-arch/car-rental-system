<?php

namespace App\Entity;

use App\Repository\CustomerRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CustomerRepository::class)]
#[ORM\Table(name: 'customers')]
class Customer
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(name: 'name', type: Types::STRING, length: 100)]
    private string $name;

    #[ORM\Column(name: 'phone', type: Types::STRING, length: 15)]
    private string $phone;

    #[ORM\Column(name: 'email', type: Types::STRING, length: 100, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(name: 'id_type', type: Types::STRING, length: 30, nullable: true)]
    private ?string $idType = null;

    #[ORM\Column(name: 'license_number', type: Types::STRING, length: 50, nullable: true)]
    private ?string $licenseNumber = null;

    #[ORM\Column(name: 'license_type', type: Types::STRING, length: 30, nullable: true)]
    private ?string $licenseType = null;

    #[ORM\Column(name: 'license_issue_date', type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $licenseIssueDate = null;

    #[ORM\Column(name: 'license_expiry_date', type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $licenseExpiryDate = null;

    #[ORM\Column(name: 'national_id', type: Types::STRING, length: 50, nullable: true)]
    private ?string $nationalId = null;

    #[ORM\Column(name: 'id_issue_date', type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $idIssueDate = null;

    #[ORM\Column(name: 'id_expiry_date', type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $idExpiryDate = null;

    #[ORM\Column(name: 'nationality', type: Types::STRING, length: 60)]
    private string $nationality;

    #[ORM\Column(name: 'gender', type: Types::STRING, nullable: true)]
    private ?string $gender = null;

    #[ORM\Column(name: 'birth_date', type: Types::DATE_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $birthDate = null;

    #[ORM\Column(name: 'job', type: Types::STRING, length: 60, nullable: true)]
    private ?string $job = null;

    #[ORM\Column(name: 'address', type: Types::TEXT, length: 65535, nullable: true)]
    private ?string $address = null;

    #[ORM\Column(name: 'residential_no', type: Types::STRING, length: 50, nullable: true)]
    private ?string $residentialNo = null;

    #[ORM\Column(name: 'postal_code', type: Types::STRING, length: 20, nullable: true)]
    private ?string $postalCode = null;

    #[ORM\Column(name: 'address_1', type: Types::STRING, length: 150, nullable: true)]
    private ?string $address1 = null;

    #[ORM\Column(name: 'address_2', type: Types::STRING, length: 150, nullable: true)]
    private ?string $address2 = null;

    #[ORM\ManyToOne(targetEntity: LicenseType::class)]
    #[ORM\JoinColumn(name: 'license_type_id', referencedColumnName: 'id', nullable: true)]
    private ?LicenseType $licenseTypeReference = null;

    #[ORM\Column(name: 'notes', type: Types::TEXT, length: 65535, nullable: true)]
    private ?string $notes = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    #[ORM\Column(name: 'deleted_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $deletedAt = null;

    #[ORM\Column(name: 'customer_type_id', type: Types::INTEGER, nullable: true)]
    private ?int $customerTypeId = null;

    public function getId(): ?int { return $this->id; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }

    public function getPhone(): string { return $this->phone; }
    public function setPhone(string $phone): self { $this->phone = $phone; return $this; }

    public function getEmail(): ?string { return $this->email; }
    public function setEmail(?string $email): self { $this->email = $email; return $this; }

    public function getIdType(): ?string { return $this->idType; }
    public function setIdType(?string $idType): self { $this->idType = $idType; return $this; }

    public function getLicenseNumber(): ?string { return $this->licenseNumber; }
    public function setLicenseNumber(?string $licenseNumber): self { $this->licenseNumber = $licenseNumber; return $this; }

    public function getLicenseType(): ?string { return $this->licenseType; }
    public function setLicenseType(?string $licenseType): self { $this->licenseType = $licenseType; return $this; }

    public function getLicenseIssueDate(): ?\DateTimeInterface { return $this->licenseIssueDate; }
    public function setLicenseIssueDate(?\DateTimeInterface $licenseIssueDate): self { $this->licenseIssueDate = $licenseIssueDate; return $this; }

    public function getLicenseExpiryDate(): ?\DateTimeInterface { return $this->licenseExpiryDate; }
    public function setLicenseExpiryDate(?\DateTimeInterface $licenseExpiryDate): self { $this->licenseExpiryDate = $licenseExpiryDate; return $this; }

    public function getNationalId(): ?string { return $this->nationalId; }
    public function setNationalId(?string $nationalId): self { $this->nationalId = $nationalId; return $this; }

    public function getIdIssueDate(): ?\DateTimeInterface { return $this->idIssueDate; }
    public function setIdIssueDate(?\DateTimeInterface $idIssueDate): self { $this->idIssueDate = $idIssueDate; return $this; }

    public function getIdExpiryDate(): ?\DateTimeInterface { return $this->idExpiryDate; }
    public function setIdExpiryDate(?\DateTimeInterface $idExpiryDate): self { $this->idExpiryDate = $idExpiryDate; return $this; }

    public function getNationality(): string { return $this->nationality; }
    public function setNationality(string $nationality): self { $this->nationality = $nationality; return $this; }

    public function getGender(): ?string { return $this->gender; }
    public function setGender(?string $gender): self { $this->gender = $gender; return $this; }

    public function getBirthDate(): ?\DateTimeInterface { return $this->birthDate; }
    public function setBirthDate(?\DateTimeInterface $birthDate): self { $this->birthDate = $birthDate; return $this; }

    public function getJob(): ?string { return $this->job; }
    public function setJob(?string $job): self { $this->job = $job; return $this; }

    public function getAddress(): ?string { return $this->address; }
    public function setAddress(?string $address): self { $this->address = $address; return $this; }

    public function getResidentialNo(): ?string { return $this->residentialNo; }
    public function setResidentialNo(?string $residentialNo): self { $this->residentialNo = $residentialNo; return $this; }

    public function getPostalCode(): ?string { return $this->postalCode; }
    public function setPostalCode(?string $postalCode): self { $this->postalCode = $postalCode; return $this; }

    public function getAddress1(): ?string { return $this->address1; }
    public function setAddress1(?string $address1): self { $this->address1 = $address1; return $this; }

    public function getAddress2(): ?string { return $this->address2; }
    public function setAddress2(?string $address2): self { $this->address2 = $address2; return $this; }

    public function getLicenseTypeReference(): ?LicenseType { return $this->licenseTypeReference; }
    public function setLicenseTypeReference(?LicenseType $licenseTypeReference): self { $this->licenseTypeReference = $licenseTypeReference; return $this; }

    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): self { $this->notes = $notes; return $this; }

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(?\DateTimeInterface $createdAt): self { $this->createdAt = $createdAt; return $this; }

    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }
    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self { $this->updatedAt = $updatedAt; return $this; }

    public function getDeletedAt(): ?\DateTimeInterface { return $this->deletedAt; }
    public function setDeletedAt(?\DateTimeInterface $deletedAt): self { $this->deletedAt = $deletedAt; return $this; }

    public function getCustomerTypeId(): ?int { return $this->customerTypeId; }
    public function setCustomerTypeId(?int $customerTypeId): self { $this->customerTypeId = $customerTypeId; return $this; }
}
