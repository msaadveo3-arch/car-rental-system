<?php

namespace App\Entity;

use App\Repository\RentalRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RentalRepository::class)]
#[ORM\Table(name: 'rentals')]
class Rental
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id', type: Types::INTEGER)]
    private ?int $id = null;

    #[ORM\Column(name: 'booking_number', type: Types::STRING, length: 20, nullable: true)]
    private ?string $bookingNumber = null;

    #[ORM\Column(name: 'contract_number', type: Types::STRING, length: 20, nullable: true)]
    private ?string $contractNumber = null;

    #[ORM\Column(name: 'rental_type', type: Types::STRING, length: 20)]
    private string $rentalType;

    #[ORM\ManyToOne(targetEntity: Customer::class)]
    #[ORM\JoinColumn(name: 'customer_id', referencedColumnName: 'id', nullable: false)]
    private Customer $customer;

    #[ORM\ManyToOne(targetEntity: Car::class)]
    #[ORM\JoinColumn(name: 'car_id', referencedColumnName: 'id', nullable: false)]
    private Car $car;

    #[ORM\Column(name: 'with_driver', type: Types::BOOLEAN)]
    private bool $withDriver;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'staff_id', referencedColumnName: 'id', nullable: false)]
    private User $staff;

    #[ORM\Column(name: 'updated_by', type: Types::INTEGER, nullable: true)]
    private ?int $updatedBy = null;

    #[ORM\ManyToOne(targetEntity: Branch::class)]
    #[ORM\JoinColumn(name: 'pickup_branch_id', referencedColumnName: 'id', nullable: true)]
    private ?Branch $pickupBranch = null;

    #[ORM\ManyToOne(targetEntity: Branch::class)]
    #[ORM\JoinColumn(name: 'return_branch_id', referencedColumnName: 'id', nullable: true)]
    private ?Branch $returnBranch = null;

    #[ORM\Column(name: 'pickup_address', type: Types::STRING, length: 150, nullable: true)]
    private ?string $pickupAddress = null;

    #[ORM\Column(name: 'dropoff_address', type: Types::STRING, length: 150, nullable: true)]
    private ?string $dropoffAddress = null;

    #[ORM\ManyToOne(targetEntity: Source::class)]
    #[ORM\JoinColumn(name: 'hirer_source_id', referencedColumnName: 'id', nullable: true)]
    private ?Source $hirerSource = null;

    #[ORM\ManyToOne(targetEntity: Border::class)]
    #[ORM\JoinColumn(name: 'cross_border_id', referencedColumnName: 'id', nullable: true)]
    private ?Border $crossBorder = null;

    #[ORM\Column(name: 'tariff_name', type: Types::STRING, length: 50, nullable: true)]
    private ?string $tariffName = null;

    #[ORM\Column(name: 'pricing_mode', type: Types::STRING, length: 50, nullable: true)]
    private ?string $pricingMode = null;

    #[ORM\Column(name: 'rental_band', type: Types::STRING, length: 20, nullable: true)]
    private ?string $rentalBand = null;

    #[ORM\Column(name: 'units', type: Types::INTEGER, nullable: true)]
    private ?int $units = null;

    #[ORM\Column(name: 'rack_rate', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $rackRate = null;

    #[ORM\Column(name: 'gross_amount', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $grossAmount = null;

    #[ORM\Column(name: 'discount_amount', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $discountAmount = null;

    #[ORM\Column(name: 'unlimited_addon', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $unlimitedAddon = null;

    #[ORM\Column(name: 'border_fee', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $borderFee = null;

    #[ORM\Column(name: 'vat_amount', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $vatAmount = null;

    #[ORM\Column(name: 'total_amount', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $totalAmount = null;

    #[ORM\Column(name: 'start_date', type: Types::DATETIME_MUTABLE)]
    private \DateTimeInterface $startDate;

    #[ORM\Column(name: 'end_date', type: Types::DATETIME_MUTABLE)]
    private \DateTimeInterface $endDate;

    #[ORM\Column(name: 'km_policy', type: Types::STRING, length: 20)]
    private string $kmPolicy;

    #[ORM\Column(name: 'allowed_km', type: Types::INTEGER, nullable: true)]
    private ?int $allowedKm = null;

    #[ORM\Column(name: 'extra_km_fee', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $extraKmFee = null;

    #[ORM\Column(name: 'actual_return_date', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $actualReturnDate = null;

    #[ORM\Column(name: 'daily_rate', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $dailyRate = null;

    #[ORM\Column(name: 'monthly_rate', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $monthlyRate = null;

    #[ORM\Column(name: 'initial_payment', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $initialPayment = null;

    #[ORM\Column(name: 'final_charges', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $finalCharges = null;

    #[ORM\Column(name: 'security_deposit', type: Types::DECIMAL, precision: 10, scale: 2, nullable: true)]
    private ?string $securityDeposit = null;

    #[ORM\ManyToOne(targetEntity: PaymentMethod::class)]
    #[ORM\JoinColumn(name: 'security_deposit_method_id', referencedColumnName: 'id', nullable: true)]
    private ?PaymentMethod $securityDepositMethod = null;

    #[ORM\Column(name: 'deposit_received', type: Types::BOOLEAN)]
    private bool $depositReceived;

    #[ORM\Column(name: 'deposit_ref', type: Types::STRING, length: 50, nullable: true)]
    private ?string $depositRef = null;

    #[ORM\ManyToOne(targetEntity: Currency::class)]
    #[ORM\JoinColumn(name: 'currency_id', referencedColumnName: 'id', nullable: true)]
    private ?Currency $currency = null;

    #[ORM\Column(name: 'status', type: Types::STRING, nullable: true)]
    private ?string $status = null;

    #[ORM\Column(name: 'notes', type: Types::TEXT, length: 65535, nullable: true)]
    private ?string $notes = null;

    #[ORM\Column(name: 'created_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(name: 'updated_at', type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updatedAt = null;

    public function getId(): ?int { return $this->id; }

    public function getBookingNumber(): ?string { return $this->bookingNumber; }
    public function setBookingNumber(?string $bookingNumber): self { $this->bookingNumber = $bookingNumber; return $this; }

    public function getContractNumber(): ?string { return $this->contractNumber; }
    public function setContractNumber(?string $contractNumber): self { $this->contractNumber = $contractNumber; return $this; }

    public function getRentalType(): string { return $this->rentalType; }
    public function setRentalType(string $rentalType): self { $this->rentalType = $rentalType; return $this; }

    public function getCustomer(): Customer { return $this->customer; }
    public function setCustomer(Customer $customer): self { $this->customer = $customer; return $this; }

    public function getCar(): Car { return $this->car; }
    public function setCar(Car $car): self { $this->car = $car; return $this; }

    public function getWithDriver(): bool { return $this->withDriver; }
    public function setWithDriver(bool $withDriver): self { $this->withDriver = $withDriver; return $this; }

    public function getStaff(): User { return $this->staff; }
    public function setStaff(User $staff): self { $this->staff = $staff; return $this; }

    public function getUpdatedBy(): ?int { return $this->updatedBy; }
    public function setUpdatedBy(?int $updatedBy): self { $this->updatedBy = $updatedBy; return $this; }

    public function getPickupBranch(): ?Branch { return $this->pickupBranch; }
    public function setPickupBranch(?Branch $pickupBranch): self { $this->pickupBranch = $pickupBranch; return $this; }

    public function getReturnBranch(): ?Branch { return $this->returnBranch; }
    public function setReturnBranch(?Branch $returnBranch): self { $this->returnBranch = $returnBranch; return $this; }

    public function getPickupAddress(): ?string { return $this->pickupAddress; }
    public function setPickupAddress(?string $pickupAddress): self { $this->pickupAddress = $pickupAddress; return $this; }

    public function getDropoffAddress(): ?string { return $this->dropoffAddress; }
    public function setDropoffAddress(?string $dropoffAddress): self { $this->dropoffAddress = $dropoffAddress; return $this; }

    public function getHirerSource(): ?Source { return $this->hirerSource; }
    public function setHirerSource(?Source $hirerSource): self { $this->hirerSource = $hirerSource; return $this; }

    public function getCrossBorder(): ?Border { return $this->crossBorder; }
    public function setCrossBorder(?Border $crossBorder): self { $this->crossBorder = $crossBorder; return $this; }

    public function getTariffName(): ?string { return $this->tariffName; }
    public function setTariffName(?string $tariffName): self { $this->tariffName = $tariffName; return $this; }

    public function getPricingMode(): ?string { return $this->pricingMode; }
    public function setPricingMode(?string $pricingMode): self { $this->pricingMode = $pricingMode; return $this; }

    public function getRentalBand(): ?string { return $this->rentalBand; }
    public function setRentalBand(?string $rentalBand): self { $this->rentalBand = $rentalBand; return $this; }

    public function getUnits(): ?int { return $this->units; }
    public function setUnits(?int $units): self { $this->units = $units; return $this; }

    public function getRackRate(): ?string { return $this->rackRate; }
    public function setRackRate(?string $rackRate): self { $this->rackRate = $rackRate; return $this; }

    public function getGrossAmount(): ?string { return $this->grossAmount; }
    public function setGrossAmount(?string $grossAmount): self { $this->grossAmount = $grossAmount; return $this; }

    public function getDiscountAmount(): ?string { return $this->discountAmount; }
    public function setDiscountAmount(?string $discountAmount): self { $this->discountAmount = $discountAmount; return $this; }

    public function getUnlimitedAddon(): ?string { return $this->unlimitedAddon; }
    public function setUnlimitedAddon(?string $unlimitedAddon): self { $this->unlimitedAddon = $unlimitedAddon; return $this; }

    public function getBorderFee(): ?string { return $this->borderFee; }
    public function setBorderFee(?string $borderFee): self { $this->borderFee = $borderFee; return $this; }

    public function getVatAmount(): ?string { return $this->vatAmount; }
    public function setVatAmount(?string $vatAmount): self { $this->vatAmount = $vatAmount; return $this; }

    public function getTotalAmount(): ?string { return $this->totalAmount; }
    public function setTotalAmount(?string $totalAmount): self { $this->totalAmount = $totalAmount; return $this; }

    public function getStartDate(): \DateTimeInterface { return $this->startDate; }
    public function setStartDate(\DateTimeInterface $startDate): self { $this->startDate = $startDate; return $this; }

    public function getEndDate(): \DateTimeInterface { return $this->endDate; }
    public function setEndDate(\DateTimeInterface $endDate): self { $this->endDate = $endDate; return $this; }

    public function getKmPolicy(): string { return $this->kmPolicy; }
    public function setKmPolicy(string $kmPolicy): self { $this->kmPolicy = $kmPolicy; return $this; }

    public function getAllowedKm(): ?int { return $this->allowedKm; }
    public function setAllowedKm(?int $allowedKm): self { $this->allowedKm = $allowedKm; return $this; }

    public function getExtraKmFee(): ?string { return $this->extraKmFee; }
    public function setExtraKmFee(?string $extraKmFee): self { $this->extraKmFee = $extraKmFee; return $this; }

    public function getActualReturnDate(): ?\DateTimeInterface { return $this->actualReturnDate; }
    public function setActualReturnDate(?\DateTimeInterface $actualReturnDate): self { $this->actualReturnDate = $actualReturnDate; return $this; }

    public function getDailyRate(): ?string { return $this->dailyRate; }
    public function setDailyRate(?string $dailyRate): self { $this->dailyRate = $dailyRate; return $this; }

    public function getMonthlyRate(): ?string { return $this->monthlyRate; }
    public function setMonthlyRate(?string $monthlyRate): self { $this->monthlyRate = $monthlyRate; return $this; }

    public function getInitialPayment(): ?string { return $this->initialPayment; }
    public function setInitialPayment(?string $initialPayment): self { $this->initialPayment = $initialPayment; return $this; }

    public function getFinalCharges(): ?string { return $this->finalCharges; }
    public function setFinalCharges(?string $finalCharges): self { $this->finalCharges = $finalCharges; return $this; }

    public function getSecurityDeposit(): ?string { return $this->securityDeposit; }
    public function setSecurityDeposit(?string $securityDeposit): self { $this->securityDeposit = $securityDeposit; return $this; }

    public function getSecurityDepositMethod(): ?PaymentMethod { return $this->securityDepositMethod; }
    public function setSecurityDepositMethod(?PaymentMethod $securityDepositMethod): self { $this->securityDepositMethod = $securityDepositMethod; return $this; }

    public function getDepositReceived(): bool { return $this->depositReceived; }
    public function setDepositReceived(bool $depositReceived): self { $this->depositReceived = $depositReceived; return $this; }

    public function getDepositRef(): ?string { return $this->depositRef; }
    public function setDepositRef(?string $depositRef): self { $this->depositRef = $depositRef; return $this; }

    public function getCurrency(): ?Currency { return $this->currency; }
    public function setCurrency(?Currency $currency): self { $this->currency = $currency; return $this; }

    public function getStatus(): ?string { return $this->status; }
    public function setStatus(?string $status): self { $this->status = $status; return $this; }

    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): self { $this->notes = $notes; return $this; }

    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(?\DateTimeInterface $createdAt): self { $this->createdAt = $createdAt; return $this; }

    public function getUpdatedAt(): ?\DateTimeInterface { return $this->updatedAt; }
    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self { $this->updatedAt = $updatedAt; return $this; }
}
