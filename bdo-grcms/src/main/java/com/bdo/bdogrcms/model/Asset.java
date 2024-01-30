package com.bdo.bdogrcms.model;

import com.bdo.bdogrcms.enums.Level;
import com.bdo.bdogrcms.enums.LifeCycleStage;
import com.bdo.bdogrcms.enums.Status;
import com.bdo.bdogrcms.enums.Type;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.math.BigInteger;
import java.util.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    private Level criticality;

    @Enumerated(EnumType.STRING)
    private Level confidentiality;

    @Enumerated(EnumType.STRING)
    private Level availability;

    @Enumerated(EnumType.STRING)
    private Level integrity;

    private String owner;

    private String location;

    private String department;

    private Integer retentionPeriod;

    private BigInteger financialValue;

    @CreationTimestamp
    private Date acquisitionDate;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Enumerated(EnumType.STRING)
    private LifeCycleStage currentLifeCycleStage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    // Additional constructors, methods, or business logic can be added as needed
}
